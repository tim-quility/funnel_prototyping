
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Icon from '../common/Icon';
import { LeadTable } from './LeadTable'; // Changed from named to default import
import LeadFilterControls from './LeadFilterControls';
import type { Lead, FilterState, PaginationMeta } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '../../utils/lead-api';
import { useDebounce } from '../../utils/hooks/UseDebounce';
import ActivityFeedWidget from './ActivityFeedWidget';
import UpcomingAppointmentsWidget from './UpcomingAppointmentsWidget';
import StatsOverviewWidget from './StatsOverviewWidget';
import TriageEntryCard from './TriageEntryCard'; // For displaying warm market triage entry
import { mockWarmMarketContacts } from '../../constants';
import SmartListView from './SmartListView';


interface DashboardPageProps {
    onViewLead: (lead: Lead | null) => void;
    fetchPage: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onViewLead, fetchPage }) => {
    const [view, setView] = useState<'myLeads' | 'smartList'>('myLeads');

    // State for the "My Leads" view
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        statuses: { include: [], exclude: [] },
        tags: { include: [], exclude: [] },
        dateAssigned: { start: null, end: null },
        dateAssignedDaysAgo: { min: null, max: null },
        lastContacted: { start: null, end: null },
        lastContactedDaysAgo: { min: null, max: null },
        amountContacted: { min: null, max: null },

        leadTypes: { include: [], exclude: [] },
        leadLevels: { include: [], exclude: [] },
        states: { include: [], exclude: [] },

    });
    const [selectedLeads, setSelectedLeads] = useState<Map<string, Lead>>(new Map());
    const [sort, setSort] = useState<{ key: keyof Lead; dir: 'asc' | 'desc' }>({ key: 'date_assigned', dir: 'desc' });
    const [pagination, setPagination] = useState({ page: 1, pageSize: 25 });

    const debouncedFilters = useDebounce(filters, 500);

    const { data, isLoading, isError, error, isFetching } = useQuery<{ leads: Lead[], meta: PaginationMeta }, Error>({
        queryKey: ['leads', debouncedFilters, sort, pagination],
        queryFn: () => fetchLeads(debouncedFilters, sort, pagination),
        enabled: view === 'myLeads', // Only fetch for this component when the view is active
    });

    // Clear selections when filters or sorting change to avoid confusion
    useEffect(() => {
        setSelectedLeads(new Map());
    }, [debouncedFilters, sort]);

    const handleSort = (key: keyof Lead) => {
        setSort(prev => ({
            key,
            dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc'
        }));
    };

    const TabButton: React.FC<{
        label: string;
        isActive: boolean;
        onClick: () => void;
        icon: string;
    }> = ({ label, isActive, onClick, icon }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg border-b-4 transition-colors ${
                isActive
                    ? 'border-quility text-quility'
                    : 'border-transparent text-quility-dark-grey hover:border-quility-dark-text'
            }`}
        >
            <Icon name={icon} size={18} />
            {label}
        </button>
    );

    const pendingTriageCount = useMemo(() => {
        return mockWarmMarketContacts.filter(c => c.status === 'pending').length;
    }, []);

    const handleViewTriage = () => {
      fetchPage('Warm_Market');
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex-shrink-0 px-4 md:px-6 pt-4 border-b border-quility-border bg-white">
                 <h1 className="text-2xl font-bold text-quility-dark-text">Leads</h1>
                 <div className="mt-4 flex justify-between items-end">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton label="My Leads" icon="q-list" isActive={view === 'myLeads'} onClick={() => setView('myLeads')} />
                        <TabButton label="Smart List" icon="zap" isActive={view === 'smartList'} onClick={() => setView('smartList')} />
                    </nav>
                 </div>
            </header>

            {view === 'myLeads' && (
                <>
                    <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-quility-border bg-white">
                        <LeadFilterControls filters={filters} onFilterChange={setFilters} isLoading={isFetching} />
                    </div>
                    <main className="flex-1 lg:grid lg:grid-cols-3 gap-6 overflow-hidden p-4 md:p-6">
                        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                            <LeadTable
                                leads={data?.leads || []}
                                isLoading={isLoading}
                                isError={isError}
                                error={error}
                                selectedLeads={selectedLeads}
                                setSelectedLeads={setSelectedLeads}
                                onViewLead={onViewLead}
                                sort={sort}
                                onSort={handleSort}
                                paginationMeta={data?.meta}
                                onPaginationChange={setPagination}
                                paginationState={pagination}
                            />
                        </div>
                        <div className="lg:flex flex-col gap-6 overflow-y-auto">
                            {pendingTriageCount > 0 && <TriageEntryCard count={pendingTriageCount} onClick={handleViewTriage} />}
                            <StatsOverviewWidget />
                            <UpcomingAppointmentsWidget fetchPage={fetchPage} onViewLead={onViewLead} />
                            <ActivityFeedWidget fetchPage={fetchPage} onViewLead={onViewLead} />
                        </div>
                    </main>
                </>
            )}

            {view === 'smartList' && (
                <SmartListView onViewLead={onViewLead} />
            )}
        </div>
    );
};

export default DashboardPage;
