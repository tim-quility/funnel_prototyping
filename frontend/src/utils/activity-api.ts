import { DateRange } from '../components/common/DateRangePicker';
import type { AgentActivity} from '../types';
import { mockActivityData } from '../constants'; 
import api from './api';

export const fetchRecentActivity = async () => {
  return [];
};


export async function fetchActivityData(range: DateRange, customStart?: Date, customEnd?: Date): Promise<AgentActivity> {
    const params: { range: DateRange; customStart?: string; customEnd?: string } = { range };

    if (range === 'custom' && customStart && customEnd) {
        params.customStart = customStart.toISOString();
        params.customEnd = customEnd.toISOString();
    }

    // MOCK DATA IMPLEMENTATION
    try {
        console.log("⚠️ MOCK MODE: Fetching Activity Data with params:", params);
        
        // Simulate network latency (e.g., 800ms)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Return the mock object defined above
        return mockActivityData;

        /* // --- ORIGINAL API CALL COMMENTED OUT ---
        const { data } = await api.get('/activity', { params });
        console.log(data)
        return data; 
        */

    } catch (error) {
        console.error("Failed to fetch activity data:", error);
        // In case of error, return an empty activity object to prevent UI crashes
        return {
            dials: [],
            scheduled: [],
            appointments: 0,
            scheduledCalls: [],
            statusChange: [],
            applications: [],
            unreadMessages: [],
            leadsPurchased: [],
            totalDials: 0,
            totalContacts: 0,
            totalApv: 0,
            totalLeadsPurchased: 0,
            contactRate: 0,
            appointmentRate: 0
        };
    }
}
