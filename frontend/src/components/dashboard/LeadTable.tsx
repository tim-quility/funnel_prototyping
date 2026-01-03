
import React, { useMemo, useRef, useEffect, useState } from 'react';
import Icon from '../common/Icon';
import type { Lead, PaginationMeta } from '../../types';
import Avatar from '../common/Avatar';
import Spinner from '../common/Spinner';
import PrimaryButton from '../common/PrimaryButton'; // New import
import { BulkActionFloatingBar } from './BulkActionFloatingBar'; // New: Import Floating Bulk Action Bar

// Helper component for Dropdown
const Dropdown: React.FC<{
    options: { value: string | number, label: string }[];
    changeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    inputValue: number;
    disabled: boolean;
}> = ({ options, changeHandler, inputValue, disabled }) => (
    <select
        value={inputValue}
        onChange={changeHandler}
        disabled={disabled}
        className="h-9 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text focus:outline-none focus:ring-1 focus:focus:ring-quility/50"
    >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);


interface LeadTableProps {
    leads: Lead[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    selectedLeads: Map<string, Lead>;
    setSelectedLeads: React.Dispatch<React.SetStateAction<Map<string, Lead>>>;
    onViewLead: (lead: Lead) => void;
    sort: { key: keyof Lead; dir: 'asc' | 'desc' };
    onSort: (key: keyof Lead) => void;
    paginationMeta?: PaginationMeta;
    paginationState: { page: number; pageSize: number; };
    onPaginationChange: (newState: { page: number; pageSize: number; }) => void;
    disableSorting?: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, isError, error, selectedLeads, setSelectedLeads, onViewLead, sort, onSort, paginationMeta, paginationState, onPaginationChange, disableSorting = false }) => {

    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    const selectedLeadIds = useMemo(() => new Set(selectedLeads.keys()), [selectedLeads]);

    // Memoize calculations for current page selection state
    const { isAllSelectedOnPage, isSomeSelectedOnPage } = useMemo(() => {
        if (leads.length === 0) {
            return { isAllSelectedOnPage: false, isSomeSelectedOnPage: false };
        }
        const currentPageLeadIds = new Set(leads.map(l => l.id));
        const selectedOnCurrentPageCount = [...selectedLeadIds].filter(id => currentPageLeadIds.has(id)).length;

        const allSelected = selectedOnCurrentPageCount > 0 && selectedOnCurrentPageCount === leads.length;
        const someSelected = selectedOnCurrentPageCount > 0 && !allSelected;

        return { isAllSelectedOnPage: allSelected, isSomeSelectedOnPage: someSelected };
    }, [leads, selectedLeadIds]);

    // Effect to set the indeterminate state of the master checkbox
    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.indeterminate = isSomeSelectedOnPage;
        }
    }, [isSomeSelectedOnPage]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedLeads(prevSelected => {
            const newMap = new Map(prevSelected);
            if (e.target.checked) {
                // Add all leads from the current page to the selection
                leads.forEach(lead => newMap.set(lead.lead_id, lead));
            } else {
                // Remove all leads from the current page from the selection
                leads.forEach(lead => newMap.delete(lead.lead_id));
            }
            return newMap;
        });
    };

    const handleSelectOne = (lead: Lead) => {
        setSelectedLeads(prev => {
            const newMap = new Map(prev);
            if (newMap.has(lead.lead_id)) {
                newMap.delete(lead.lead_id);
            } else {
                newMap.set(lead.lead_id, lead);
            }
            return newMap;
        });
    };


    const formatDate = (isoString: string | null) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleDateString();
    };

    const SortableHeader: React.FC<{ sortKey: keyof Lead, children: React.ReactNode }> = ({ sortKey, children }) => (
        <th
            scope="col"
            className={`px-4 py-3 text-left text-xs font-bold text-quility-dark-text uppercase tracking-wider ${disableSorting ? '' : 'cursor-pointer hover:bg-quility-hover-grey'}`}
            onClick={() => !disableSorting && onSort(sortKey)}
        >
            <div className="flex items-center">
                {children}
                {!disableSorting && sort.key === sortKey && <Icon name={sort.dir === 'asc' ? 'chevron-up' : 'chevron-down'} size={14} className="ml-1" />}
            </div>
        </th>
    );

    const selectedCount = selectedLeadIds.size;


    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-quility-border shadow-sm overflow-hidden">
            <div className="flex-grow overflow-y-auto">
                <table className="min-w-full divide-y divide-quility-border">
                    <thead className="bg-quility-accent-bg sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="p-4 w-12">
                                <input
                                    type="checkbox"
                                    ref={selectAllCheckboxRef}
                                    checked={isAllSelectedOnPage}
                                    onChange={handleSelectAll}
                                    className="qCheckBox"
                                />
                            </th>
                            <SortableHeader sortKey="name">Name</SortableHeader>
                            <SortableHeader sortKey="status">Status</SortableHeader>
                            <SortableHeader sortKey="lead_type">Type</SortableHeader>
                            <SortableHeader sortKey="state">State</SortableHeader>
                            <SortableHeader sortKey="amount_contacted">Contacted</SortableHeader>
                            <SortableHeader sortKey="last_contacted">Last Contact</SortableHeader>
                            <SortableHeader sortKey="date_assigned">Assigned</SortableHeader>
                            <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-quility-block-bg divide-y divide-quility-border">
                        {isLoading ? (
                            <tr><td colSpan={9}><Spinner /></td></tr>
                        ) : isError ? (
                            <tr><td colSpan={9} className="text-center py-10 text-red-500">Error loading leads: {error?.message}</td></tr>
                        ) : leads.length > 0 ? (
                            leads.map(lead => (
                                <tr key={lead.lead_id} className="hover:bg-quility-light-hover">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedLeadIds.has(lead.lead_id)}
                                            onChange={() => handleSelectOne(lead)}
                                            className="qCheckBox"
                                        />
                                    </td>
                                    <td onClick={() => onViewLead(lead)} className="px-4 py-3 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={lead.name} avatarUrl={lead.avatarUrl} size={32} />
                                            <span className="font-medium text-quility-dark-text truncate">{lead.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-grey">{lead.status}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-grey">{lead.lead_type}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-grey">{lead.state}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-grey">{lead.amount_contacted}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-grey">{formatDate(lead.last_contacted)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-grey">{formatDate(lead.date_assigned)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => onViewLead(lead)} className="text-quility-button hover:underline">View</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={9} className="text-center py-10 text-quility-dark-grey">No leads found. Adjust your filters or add new leads.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer - Pagination Only */}
            {paginationMeta && (
                <div className="p-4 bg-quility-accent-bg flex-shrink-0 flex justify-between items-center border-t border-quility-border">
                    <div className="text-sm text-quility-dark-grey">
                        Showing {paginationMeta.from} to {paginationMeta.to} of {paginationMeta.total} results.
                    </div>

                    {/* Pagination Controls */}
                    <nav className="flex items-center gap-2">
                        <Dropdown
                            options={[
                                { value: 10, label: '10 / page' },
                                { value: 25, label: '25 / page' },
                                { value: 50, label: '50 / page' },
                            ]}
                            changeHandler={(e) => onPaginationChange({ page: 1, pageSize: parseInt(e.target.value, 10) })}
                            inputValue={paginationState.pageSize}
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => onPaginationChange({ ...paginationState, page: paginationState.page - 1 })}
                            disabled={paginationState.page <= 1 || isLoading}
                            className="pagination-control-button"
                        >
                            <Icon name="q-chevron-left" size={16} className="text-quility-dark-grey" />
                        </button>
                        <span className="text-sm font-semibold text-quility-dark-text">Page {paginationState.page} of {paginationMeta.lastPage}</span>
                        <button
                            onClick={() => onPaginationChange({ ...paginationState, page: paginationState.page + 1 })}
                            disabled={paginationState.page >= paginationMeta.lastPage || isLoading}
                            className="pagination-control-button"
                        >
                            <Icon name="q-chevron-right" size={16} className="text-quility-dark-grey" />
                        </button>
                    </nav>
                </div>
            )}
            {/* Floating Bulk Action Bar */}
            {selectedCount > 0 && (
                <BulkActionFloatingBar
                    selectedLeads={selectedLeads}
                    setSelectedLeads={setSelectedLeads}
                    onViewLead={onViewLead}
                />
            )}
        </div>
    );
};