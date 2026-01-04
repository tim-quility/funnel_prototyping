# Recruiting Module - Business Requirements & Technical Specifications

**Version:** 1.0
**Date:** October 26, 2023
**Status:** Draft / Ready for Review

---

## 1. Executive Summary

This document outlines the requirements for implementing the **Recruiting Module** within the Funnel CRM application. Currently, a high-fidelity frontend prototype exists (`frontend/src/components/recruiting`), backed by mock data.

The objective is to operationalize this prototype by building a robust backend architecture, integrating with the existing database, and implementing necessary automation logic for SMS and Email. The Recruiting Module allows agents and agencies to manage their recruiting pipeline, from lead capture to hiring, with automated workflows and resource distribution.

---

## 2. Functional Requirements

### 2.1. Access Control
*   **Permission:** Access to the Recruiting Center is binary, controlled by the `recruitingModuleActive` flag on the Agent profile.
*   **Upsell:** If a user attempts to access the module without this flag, they are presented with an upsell/activation flow (existing frontend behavior).

### 2.2. Recruiting Dashboard
*   **KPI Display:** Show real-time metrics:
    *   Total Candidates (Count of `lead_type='recruiting'`).
    *   Active Pipelines (Count of configured pipelines).
    *   Conversion Rate (Percentage of recruits moving to "Hired" or terminal success stage).
*   **Recent Activity:** Feed of recent status changes, notes, or applications for recruits.
*   **Gamification (Badges):** Display earned badges.
    *   *Note:* Badge awarding logic is currently **Manual**. Admins/Managers will manually assign badges via database or future admin UI.

### 2.3. Pipeline Management (Kanban)
*   **Customizable Pipelines:** Users can create multiple pipelines (e.g., "Standard Agent", "Admin Staff").
*   **Stages:** Each pipeline consists of ordered stages (e.g., "New Lead", "Interview", "Contract Sent", "Hired").
*   **Drag-and-Drop:** Users can move Recruits between stages.
*   **Automations:**
    *   **Trigger:** Moving a recruit to a specific stage.
    *   **Actions:**
        *   **Send SMS:** Send a pre-configured text template.
        *   **Send Packet:** Email a "Resource Packet" (collection of PDF/Video links).

### 2.4. Recruit Management
*   **Recruit Profile:** Detailed view of a candidate (extends standard Lead profile).
*   **Data Points:** Name, Phone, Email, License Status, State, Source, Notes.
*   **Identification:** Recruits are stored in the `lead` table with `lead_type = 'recruiting'`.

### 2.5. Resources & Packets
*   **Resource Library:** Upload/Link content (Videos, PDFs, Scripts).
*   **Packets:** Bundle multiple resources into a single deliverable (Packet).
*   **Distribution:** Packets are sent via Email.

### 2.6. Job Posts & Feeds
*   **Templates:** Create rich-text job descriptions.
*   **XML Feeds:**
    *   Generate public XML URLs for job boards (Indeed, ZipRecruiter, etc.).
    *   Feeds aggregate selected Job Post Templates and target specific cities.
    *   **Public Access:** These XML URLs must be accessible without authentication for scrapers.

---

## 3. Data Architecture

### 3.1. Database Schema
The solution utilizes MySQL/MariaDB. The following tables must be created/updated.

#### 3.1.1. Existing Table Integration: `lead`
*   **Recruit Identification:**
    *   `lead_type`: Must be set to `'recruiting'` for all candidates.
*   **Status Tracking:**
    *   `lead_status`: Maps to the *Stage Name* or *Stage ID* in the pipeline.
    *   `status_history`: JSON or delimited string tracking stage movements.

#### 3.1.2. New Tables (DDL)

**`recruiting_pipelines`**
Stores stage configurations and automation rules per user/tenant.
```sql
CREATE TABLE IF NOT EXISTS `recruiting_pipelines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tenant_id` VARCHAR(36) NOT NULL,
  `agent_id` VARCHAR(100) NOT NULL,
  `pipelines_config` JSON NOT NULL, -- Structure: [{id, name, stages: [{id, title, automations: []}]}]
  `default_stage` VARCHAR(45) NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_recruiting_pipelines_tenant_agent` (`tenant_id`, `agent_id`),
  CONSTRAINT `fk_recruiting_pipelines_agent_id` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**`recruiting_resources`**
Individual content items.
```sql
CREATE TABLE IF NOT EXISTS `recruiting_resources` (
  `id` VARCHAR(36) NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `agent_id` VARCHAR(100) NOT NULL,
  `type` ENUM('video', 'document', 'script') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100),
  `content_url` VARCHAR(2048),
  `thumbnail_url` VARCHAR(2048),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_recruiting_resources_tenant_agent` (`tenant_id`, `agent_id`),
  CONSTRAINT `fk_recruiting_resources_agent_id` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**`recruiting_resource_packets`**
Bundles of resources.
```sql
CREATE TABLE IF NOT EXISTS `recruiting_resource_packets` (
  `id` VARCHAR(36) NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `agent_id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `resource_ids` JSON NOT NULL, -- Array of recruiting_resources.id
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_recruiting_resource_packets_tenant_agent` (`tenant_id`, `agent_id`),
  CONSTRAINT `fk_recruiting_resource_packets_agent_id` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**`job_post_templates`**
```sql
CREATE TABLE IF NOT EXISTS `job_post_templates` (
  `id` VARCHAR(36) NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `agent_id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_job_post_templates_tenant_agent` (`tenant_id`, `agent_id`),
  CONSTRAINT `fk_job_post_templates_agent_id` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**`recruiting_badges` & `agent_recruiting_badges`**
Standard gamification tables as defined in provided SQL.

---

## 4. Technical Specifications

### 4.1. API Architecture
A new Controller (`recruitingController.js`) and Route file (`routes/recruiting.js`) must be created. All API routes (except public feeds) must be protected by `authMiddleware`.

#### Core Endpoints
| Method | Endpoint | Description |
|Search | `/api/recruiting/data` | Aggregate fetch for Dashboard (Recruits, Pipelines, Stats). |
| GET | `/api/recruiting/badges` | Fetch earned badges for the agent. |
| PUT | `/api/recruiting/pipelines` | Save pipeline configuration and stage order. |
| POST | `/api/recruiting/recruits` | Create a new Recruit (Lead type = 'recruiting'). |
| PUT | `/api/recruiting/recruits/:id` | Update Recruit details or **Stage**. |
| POST | `/api/recruiting/resources` | Create a Resource. |
| POST | `/api/recruiting/packets` | Create a Packet. |
| POST | `/api/recruiting/job-posts` | Create a Job Post Template. |
| GET | `/api/recruiting/feeds` | Get list of configured Job Feeds. |
| POST | `/api/recruiting/feeds` | Create a Job Feed configuration. |

#### Public Endpoints (No Auth)
| Method | Endpoint | Description |
| GET | `/feeds/:feedId.xml` | Returns XML content for job boards. Content-Type: `text/xml`. |

### 4.2. Integration Services

#### 4.2.1. Outbound SMS (Twilio)
*   **Requirement:** Implement a helper service to send SMS.
*   **Library:** `twilio` (already in `package.json`).
*   **Usage:** Triggered when a Recruit is moved to a stage with a "Send Text" automation.
*   **Payload:** Must support template variable substitution (e.g., `{{FirstName}}`).

#### 4.2.2. Email Service (Resource Packets)
*   **Requirement:** Implement an email transport service (e.g., `nodemailer` or SendGrid API).
*   **Trigger:** Triggered when a Recruit is moved to a stage with a "Send Packet" automation.
*   **Content:** HTML email containing a list of links to the Resources defined in the Packet.

### 4.3. Job Feed XML Generation
*   **Format:** Must adhere to standard Job Feed XML schemas (e.g., Indeed/ZipRecruiter format).
*   **Structure Example:**
    ```xml
    <source>
      <job>
        <title>Sales Agent</title>
        <date>2023-10-26</date>
        <referencenumber>JOB-123</referencenumber>
        <url>...</url>
        <city>Denver</city>
        <state>CO</state>
        <description>...</description>
      </job>
    </source>
    ```
*   **Dynamic Generation:** Feeds should be generated on-the-fly when the URL is requested, querying the `job_post_templates` and mapped cities.

---

## 5. Implementation Roadmap

1.  **Database Migration:** Execute DDL scripts to create new tables.
2.  **Backend Services:**
    *   Implement `SmsService` (Twilio wrapper).
    *   Implement `EmailService` (SMTP/API wrapper).
    *   Implement `XmlFeedService`.
3.  **API Development:**
    *   Scaffold `recruitingController`.
    *   Implement CRUD logic for Resources, Packets, and Templates.
    *   Implement logic for `recruits` (interacting with `lead` table).
4.  **Automation Logic:**
    *   In `updateRecruit` (Stage Change), check `recruiting_pipelines` config.
    *   If automation exists for the new stage, trigger `SmsService` or `EmailService` asynchronously.
5.  **Frontend Integration:**
    *   Update `recruiting-api.ts` to replace Mock `delay()` calls with real `api.get/post` calls.
    *   Remove mock data files.

## 6. Assumptions
*   The `agent` table already exists and handles authentication.
*   The `lead` table schema provided is accurate and stable.
*   Twilio credentials (SID, Token, From Number) are available in environment variables.
