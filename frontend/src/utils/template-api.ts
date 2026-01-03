import api from './api';
import type { TextTemplate, EmailTemplate } from '../types';
import { mockTextTemplates, mockEmailTemplates } from '../constants'; // Import mock data

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// NOTE: In a real application, the localStorage logic below would be removed.
// It is kept here for the mock API to function.
const TEXT_TEMPLATE_STORAGE_KEY = 'mock_text_templates';
const EMAIL_TEMPLATE_STORAGE_KEY = 'mock_email_templates';

// --- Text Template Local Storage Helpers ---
const getStoredTextTemplates = (): TextTemplate[] => {
    try {
        const stored = localStorage.getItem(TEXT_TEMPLATE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse stored text templates, using empty array.", e);
        return [];
    }
}

const setStoredTextTemplates = (templates: TextTemplate[]) => {
    localStorage.setItem(TEXT_TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

// --- Email Template Local Storage Helpers ---
const getStoredEmailTemplates = (): EmailTemplate[] => {
    try {
        const stored = localStorage.getItem(EMAIL_TEMPLATE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse stored email templates, using empty array.", e);
        return [];
    }
}

const setStoredEmailTemplates = (templates: EmailTemplate[]) => {
    localStorage.setItem(EMAIL_TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

// Initialize mock data in local storage if not present
if (!localStorage.getItem(TEXT_TEMPLATE_STORAGE_KEY)) {
    setStoredTextTemplates(mockTextTemplates);
}
if (!localStorage.getItem(EMAIL_TEMPLATE_STORAGE_KEY)) {
    setStoredEmailTemplates(mockEmailTemplates);
}


// =============================================================================
// API Functions for Text Templates
// =============================================================================

export async function fetchTextTemplates(): Promise<TextTemplate[]> {
    
    // =============================================================================
    // REAL API REQUEST
    // =============================================================================
    /*try {
        const response = await api.get('/templates/text'); // Assumes GET /api/templates/text endpoint
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Failed to fetch text templates:", error);
        throw error;
    }*/
    

    // MOCK IMPLEMENTATION
    await delay(500);
    return getStoredTextTemplates();
}
