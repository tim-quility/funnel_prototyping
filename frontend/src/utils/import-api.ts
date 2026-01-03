
// Configuration for the backend URL

import api from "./api";


interface ImportPayload {
    leads: any[];
    mapping: Record<string, string>;
    agentId: number | string;
}
/*
export async function importLeadsCSV(payload: ImportPayload) {
    try {
        const response = await fetch(`${API_BASE_URL}/import/csv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Import API Error:", error);
        throw error;
    }
}*/


export async function importLeadsCSV(payload: ImportPayload): Promise<any> {
    try {
        const { data } = await api.post('/import/csv', payload);
        return data;
    } catch (error) {
        console.error("Import API Error:", error);
        throw error;
    }
}