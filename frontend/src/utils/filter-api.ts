// Mock filter API
/*export const fetchFilterOptions = async () => ({
  states: ['CA', 'TX', 'NY', 'FL'],
  leadTypes: ['Final Expense', 'Mortgage Protection'],
  leadLevels: ['Hot', 'Warm', 'Cold'],
});*/
import type { FilterOptions } from '../types';
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        statuses: [
            { id: 1, name: 'New' },
            { id: 2, name: 'In Progress' },
            { id: 3, name: 'Bad Lead' },
            { id: 4, name: 'Sold' },
            { id: 5, name: 'No Answer' }
        ],
        tags: [
            { id: 'tag_001', name: 'Urgent' },
            { id: 'tag_002', name: 'VIP' },
            { id: 'tag_003', name: 'Spanish Speaker' },
            { id: 'tag_004', name: 'Refi Candidate' }
        ],
        leadTypes: [
            { id: 'lt_fe', name: 'Final Expense' },
            { id: 'lt_mp', name: 'Mortgage Protection' },
            { id: 'lt_iul', name: 'IUL' },
            { id: 'lt_ann', name: 'Annuity' }
        ],
        leadLevels: [
            { id: 'lvl_hot', name: 'Hot' },
            { id: 'lvl_warm', name: 'Warm' },
            { id: 'lvl_cold', name: 'Cold' },
            { id: 'lvl_recycl', name: 'Recycled' }
        ],
        states: [
            { id: 'CA', name: 'California' },
            { id: 'TX', name: 'Texas' },
            { id: 'FL', name: 'Florida' },
            { id: 'NY', name: 'New York' },
            { id: 'CO', name: 'Colorado' }
        ]
    };
};