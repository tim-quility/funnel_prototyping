import api from './api';
import type { Lead, FilterState, PaginationMeta, SmartListRule } from '../types';
import { MOCK_LEADS } from '../constants'; 

interface PaginatedLeadsResponse {
    leads: Lead[];
    meta: PaginationMeta;
}


export async function fetchLeads(
    filters: FilterState,
    sort: { key: keyof Lead; dir: 'asc' | 'desc' },
    pagination: { page: number, pageSize: number }
): Promise<PaginatedLeadsResponse> {
    
    // MOCK IMPLEMENTATION
    try {
        console.log("⚠️ MOCK MODE: Fetching Leads", { filters, sort, pagination });
        await new Promise(resolve => setTimeout(resolve, 600)); // 600ms latency

        // Mock Pagination Logic
        const total = 45; // Pretend we have 45 total leads
        const from = (pagination.page - 1) * pagination.pageSize + 1;
        const to = Math.min(from + pagination.pageSize - 1, total);
        const lastPage = Math.ceil(total / pagination.pageSize);

        return {
            leads: MOCK_LEADS, // Always returning the 3 mock leads for demo purposes
            meta: {
                total,
                perPage: pagination.pageSize,
                currentPage: pagination.page,
                lastPage,
                from,
                to
            }
        };

        /* ORIGINAL CODE
        const payload = { filters, sort, pagination };
        const { data } = await api.post('/leads/filter', payload);
        return data;
        */
    } catch (error) {
        console.error("Failed to fetch leads:", error);
        throw error;
    }
}

export async function bulkSendText(payload: {
    leadIds: string[];
    templateId?: string;
    customText?: string;
    saveAsTemplate?: { title: string; category: string };
}): Promise<{ message: string }> {
    
    // MOCK IMPLEMENTATION
    console.log("⚠️ MOCK MODE: Bulk Sending Text", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { message: `Successfully queued messages for ${payload.leadIds.length} leads.` };
    
    /* ORIGINAL CODE
    const { data } = await api.post('/leads/bulk-text', payload);
    return data;
    */
}

export async function bulkUpdateLeads(payload: {
    leadIds: string[];
    action: 'add-workflow' | 'add-tag' | 'change-status';
    value: string | string[] | number;
}): Promise<{ message: string }> {

    // MOCK IMPLEMENTATION
    console.log("⚠️ MOCK MODE: Bulk Updating Leads", payload);
    await new Promise(resolve => setTimeout(resolve, 800));

    return { message: `Successfully updated ${payload.leadIds.length} leads with action: ${payload.action}` };

    /* ORIGINAL CODE
    const { data } = await api.post('/leads/bulk-update', payload);
    return data;
    */
}

export async function fetchSmartListLeads(
    rules: SmartListRule[],
    pagination: { page: number, pageSize: number }
): Promise<PaginatedLeadsResponse> {
    
    // MOCK IMPLEMENTATION
    try {
        console.log("⚠️ MOCK MODE: Fetching Smart List", { rules, pagination });
        await new Promise(resolve => setTimeout(resolve, 700));

        // Reusing the same mock leads response structure
        const total = 12; 
        const from = (pagination.page - 1) * pagination.pageSize + 1;
        
        return {
            leads: MOCK_LEADS, 
            meta: {
                total,
                perPage: pagination.pageSize,
                currentPage: pagination.page,
                lastPage: Math.ceil(total / pagination.pageSize),
                from,
                to: Math.min(from + pagination.pageSize - 1, total)
            }
        };

        /* ORIGINAL CODE
        const payload = { rules, pagination };
        const { data } = await api.post('/leads/smart-list', payload);
        return data;
        */
    } catch (error) {
        console.error("Failed to fetch smart list leads:", error);
        throw error;
    }
}