import type { Tag } from '../types';

// Mock Tag API
export const fetchTags = async (): Promise<Tag[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
};

// Fixed: Correct return type and implementation for mock createTag
export const createTag = async (tag: Omit<Tag, 'id' | 'created' | 'lead_count'>): Promise<Tag> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: tag.name,
        lead_count: 0,
        created: Math.floor(Date.now() / 1000)
    };
};

// Fixed: Added missing export for tagLead
export const tagLead = async (leadId: string, tagId: string): Promise<void> => {
    console.log(`⚠️ MOCK MODE: Tagging lead ${leadId} with tag ${tagId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
};