# Product Requirements Document: CSV Lead Import

**Date:** 2023-10-27
**Author:** Jules (BSA)
**Status:** Draft / Specification
**Target System:** Funnel CRM (Production)

---

## 1. Executive Summary
This document outlines the functional and technical requirements for the "Import Leads via CSV" feature. The goal is to allow agents to bulk-import leads (up to 20,000 records) from external sources into the CRM. This feature must support robust data validation, intelligent deduplication (non-destructive), and persistent user mapping preferences.

This specification serves as the source of truth for Engineering and QA teams to migrate the current prototype into a production-ready feature.

---

## 2. User Flow & UI Requirements

### 2.1. File Upload
- **Supported Format:** CSV (`.csv`) only.
- **Parsing Library:** The frontend must use a robust parsing library (e.g., `PapaParse`) to handle edge cases like commas within quoted strings, which the current prototype fails to handle.
- **Size Limits:**
  - Max Rows: ~20,000.
  - File Size: Max ~10MB (Soft limit, driven by row count).
- **UX:** Drag-and-drop zone with file browser fallback. Immediate client-side validation for file type.

### 2.2. Column Mapping
- **Auto-Mapping:** The system should attempt to fuzzy-match CSV headers to database fields (e.g., "First Name" -> `borrower_first`).
- **Manual Mapping:** Users can manually map CSV columns to system fields using a dropdown.
- **Saved Profiles (New Feature):**
  - Users must be able to **Save** their current mapping configuration as a "Profile" (e.g., "Facebook Leads Mapping").
  - Users must be able to **Load** previously saved profiles.
  - **Storage:** Profiles must be stored in the **Database** (not LocalStorage) to persist across devices/sessions.

### 2.3. Data Enrichment Steps
- **Lead Type Mapping:**
  - If `lead_type` is not mapped from the CSV, the user must select a global Lead Type (e.g., "Mortgage Protection") to apply to all imported records.
  - If mapped, the system must validate CSV values against system Lead Types.
- **Status Mapping:**
  - If `status` is mapped, the system must scan the CSV for unique status values (e.g., "Sold", "New") and prompt the user to map them to System Status IDs.

### 2.4. Preview & Confirmation
- Display a preview of the first 5-10 rows *after* mapping and formatting rules have been applied.
- Show a count of "Valid Rows" vs. "Invalid Rows" (based on strict validation).

### 2.5. Summary & Error Handling
- **Success:** Display total count of created vs. updated records.
- **Failure:** If rows fail validation (e.g., missing required fields), provide a downloadable CSV of *just* the failed rows, including a `failure_reason` column.

---

## 3. Functional Requirements: Data Processing

### 3.1. Strict Data Validation
The system must enforce strict formatting before attempting database insertion.

| Field | Requirement | Transformation Example |
| :--- | :--- | :--- |
| **Phone** | Strip non-numeric characters. Enforce 10 digits. | `(555) 123-4567` -> `5551234567` |
| **Date** | Enforce ISO 8601 (`YYYY-MM-DD`). | `01/15/1980` -> `1980-01-15` |
| **State** | Validate against US State List. Store 2-letter Code. | `California` -> `CA` |
| **Zip** | Integer/String validation (5 digits). | `90210` |
| **Tobacco** | Boolean normalization. | `Yes`, `Y`, `True` -> `1` (or `true`) |

### 3.2. Deduplication Strategy (Non-Destructive)
The system must identify existing leads to prevent creating duplicates.

1.  **Identity Resolution (Priority Order):**
    1.  **Primary Key:** Phone Number (Normalized 10-digit).
    2.  **Secondary Key:** Email Address.

2.  **Merge Logic (Non-Destructive Update):**
    - **Scenario A (New Lead):** No match found -> **Insert** new record.
    - **Scenario B (Existing Lead):** Match found -> Check individual fields.
      - If *Target DB Field* is `NULL` or `Empty` AND *Source CSV Field* has data -> **Update** field.
      - If *Target DB Field* has data -> **Skip** (Do not overwrite existing data).
      - If no new data is merged -> **Skip** update entirely (optimize DB writes).

### 3.3. Performance & Architecture
- **Problem:** The current prototype sends 20k rows in a single JSON payload, which will timeout.
- **Requirement:**
  - **Chunking:** Frontend must split the CSV into chunks (e.g., 500-1000 rows) and send them sequentially or in parallel.
  - **Streaming (Engineering Choice):** Backend should process these chunks asynchronously.
  - **Recommendation:** Use the existing **Kafka** infrastructure if available for "Lead Ingestion Events" to handle high throughput and decoupling.

---

## 4. Database Schema Requirements

### 4.1. New Table: `import_mapping_profiles`
To support the requirement of saving mappings to the database.

```sql
CREATE TABLE import_mapping_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_id INT NOT NULL, -- Owner of the profile
    profile_name VARCHAR(255) NOT NULL,
    mapping_json JSON NOT NULL, -- Stores the { "csv_header": "db_field" } map
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);
```

---

## 5. API Specifications (Proposed)

### 5.1. `GET /api/import/profiles`
- **Purpose:** Fetch saved mapping profiles for the logged-in agent.
- **Response:** List of `{ id, name, mapping }`.

### 5.2. `POST /api/import/profiles`
- **Purpose:** Save a new mapping profile.
- **Body:** `{ name: string, mapping: object }`.

### 5.3. `POST /api/import/chunk` (or `/api/import/stream`)
- **Purpose:** Upload a batch of processed lead data.
- **Body:**
  ```json
  {
      "batchId": "uuid",
      "isLastBatch": boolean,
      "mapping": { ... },
      "leads": [ ... ]
  }
  ```

---

## 6. QA & Acceptance Criteria

1.  **Dedupe Test:** Import a CSV containing a phone number that already exists in the DB.
    - *Expected:* The existing record's `borrower_first` (if populated) is NOT changed. The existing record's `zip` (if empty) IS updated.
2.  **Validation Test:** Import a CSV with phone `(555) 123-4567` and Date `Jan 1st 2020`.
    - *Expected:* DB stores `5551234567` and `2020-01-01`.
3.  **Profile Test:** Save a mapping profile on Browser A. Log in on Browser B.
    - *Expected:* The profile is available in the dropdown.
4.  **Volume Test:** Import a file with 20,000 rows.
    - *Expected:* The UI shows a progress bar. The browser does not freeze. All leads are imported.
