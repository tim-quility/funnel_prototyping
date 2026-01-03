
import { LeadStatus } from '../types/status.types';
import { MOCK_LEAD_STATUSES } from '../constants/status.constants';

// Simulated API call with potential for real implementation
export const fetchStatuses = async (): Promise<LeadStatus[]> => {
  // In real implementation: return api.get('/statuses');
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_LEAD_STATUSES), 300);
  });
};
