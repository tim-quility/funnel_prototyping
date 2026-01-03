


import React, { useState, useEffect } from 'react';
import { LeadTable } from './LeadTable'; // Changed from named to default import
import type { Lead, SmartListRule, PaginationMeta } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchSmartListLeads } from '../../utils/lead-api';
import { DEFAULT_SMART_LIST_RULES } from '../../constants';
import SmartListConfigModal from './SmartListConfigModal';
import Icon from '../common/Icon'; // Import Icon

interface SmartListViewProps {
    onViewLead: (lead: Lead) => void;
}

const SMART_LIST_CONFIG_KEY = 'funnel-smart-list-config';

const SmartListView: React.FC<SmartListViewProps> = ({ onViewLead }) => {
    const [rules, setRules] = useState<SmartListRule[]>(() => {
        try {
            const savedConfig = localStorage.getItem(SMART_LIST_CONFIG_KEY);
            return savedConfig ? JSON.parse(savedConfig) : DEFAULT_SMART_LIST_RULES;
        } catch (error) {
            return DEFAULT_SMART_LIST_RULES;
        }
    });

    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    // FIX: Switched from Set<string> to Map<string, Lead> to be consistent with LeadTable's expected props.
    const [selectedLeads, setSelectedLeads] = useState<Map<string, Lead>>(new Map());
    const [pagination, setPagination] = useState({ page: 1, pageSize: 25 });

    // This query depends on the rules state. When rules change, it will refetch.
    const { data, isLoading, isError, error } = useQuery<{ leads: Lead[], meta: PaginationMeta }, Error>({
        queryKey: ['smartListLeads', rules, pagination],
        queryFn: () => fetchSmartListLeads(rules, pagination),
    });

    const handleSaveConfig = (newRules: SmartListRule[]) => {
        setRules(newRules);
        localStorage.setItem(SMART_LIST_CONFIG_KEY, JSON.stringify(newRules));
        setIsConfigModalOpen(false);
    };

    // Smart List table sorting is disabled, so this handler is a no-op
    const handleSort = () => { /* No-op */ };

    return (
        <>
            <div className="px-4 md:px-6 py-4 border-b border-quility-border bg-white flex justify-between items-center">
                <p className="text-sm text-quility-dark-grey">
                    Showing leads prioritized by your custom rules.
                </p>
                <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-accent-bg"
                >
                    <Icon name="settings" size={16} />
                    Configure Rules
                </button>
            </div>
            <main className="flex-1 overflow-hidden p-4 md:p-6">
                <LeadTable
                    leads={data?.leads || []}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    selectedLeads={selectedLeads}
                    setSelectedLeads={setSelectedLeads}
                    onViewLead={onViewLead}
                    sort={{ key: 'date_assigned', dir: 'desc' }} // Dummy sort, as it's disabled
                    onSort={handleSort} // Pass the no-op handler
                    disableSorting={true}
                    paginationMeta={data?.meta}
                    onPaginationChange={setPagination}
                    paginationState={pagination}
                />
            </main>
            {isConfigModalOpen && (
                <SmartListConfigModal
                    initialRules={rules}
                    onClose={() => setIsConfigModalOpen(false)}
                    onSave={handleSaveConfig}
                />
            )}
        </>
    );
};

export default SmartListView;