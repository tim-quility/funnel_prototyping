
export type UnderlyingStatus = 'ni' | 'taken' | 'contact' | 'no_contact' | 'appointment' | 'application' | 'dnc';

export interface StatusCategory {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

export interface LeadStatus {
  id: string;
  name: string;
  categoryId: string;
  underlyingStatus: UnderlyingStatus;
  appointment: boolean;
  contact: boolean;
  application: boolean;
}
