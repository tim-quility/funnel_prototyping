
import { StatusCategory, LeadStatus } from '../types/status.types';

export const MOCK_STATUS_CATEGORIES: StatusCategory[] = [
  { id: 'cat_new', name: 'New', color: '#3b82f6', sortOrder: 1 },
  { id: 'cat_working', name: 'Active', color: '#10b981', sortOrder: 2 },
  { id: 'cat_closed', name: 'Closed', color: '#6b7280', sortOrder: 3 },
  { id: 'cat_dnc', name: 'DNC', color: '#ef4444', sortOrder: 4 },
];

export const MOCK_LEAD_STATUSES: LeadStatus[] = [
  { id: '1', name: 'New Lead', categoryId: 'cat_new', underlyingStatus: 'ni', appointment: false, contact: false, application: false },
  { id: '2', name: 'Attempted Contact', categoryId: 'cat_working', underlyingStatus: 'no_contact', appointment: false, contact: false, application: false },
  { id: '3', name: 'Contacted', categoryId: 'cat_working', underlyingStatus: 'contact', appointment: false, contact: true, application: false },
  { id: '4', name: 'Appointment Set', categoryId: 'cat_working', underlyingStatus: 'appointment', appointment: true, contact: true, application: false },
  { id: '5', name: 'Sit No Sale', categoryId: 'cat_working', underlyingStatus: 'contact', appointment: false, contact: true, application: false },
  { id: '6', name: 'Application Taken', categoryId: 'cat_working', underlyingStatus: 'application', appointment: false, contact: true, application: true },
  { id: '7', name: 'Sold / Issued', categoryId: 'cat_closed', underlyingStatus: 'taken', appointment: false, contact: true, application: true },
  { id: '8', name: 'Lost / Declined', categoryId: 'cat_closed', underlyingStatus: 'ni', appointment: false, contact: false, application: false },
  { id: '9', name: 'Do Not Call', categoryId: 'cat_dnc', underlyingStatus: 'dnc', appointment: false, contact: false, application: false },
];
