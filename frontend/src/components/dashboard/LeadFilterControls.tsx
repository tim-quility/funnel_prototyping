
import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../common/Icon';
import type { FilterState, FilterOptions, FilterValue, SavedFilter } from '../../types'; // FIX: Imported FilterValue
import Popover from '../common/Popover';
import FilterFieldSelector from './filter-popovers/FilterFieldSelector';
import LeadFilterPills from './LeadFilterPills';
import ListFilterControl from './filter-popovers/ListFilterControl';
import PrimaryButton from '../common/PrimaryButton'; // New import
import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../../utils/filter-api';
import OutlineButton from '../common/OutlineButton';
import SaveFilterModal from './filter-popovers/SaveFilterModal';
import DaysAgoRangeFilterControl from './filter-popovers/DaysAgoRangeFilterControl';

interface LeadFilterControlsProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    isLoading: boolean;
}

type FilterFieldKey = keyof Omit<FilterState, 'searchTerm' | 'dateAssigned' | 'lastContacted' | 'amountContacted' | 'dateAssignedDaysAgo' | 'lastContactedDaysAgo'> | 'dateAssignedDaysAgo' | 'lastContactedDaysAgo';


const LeadFilterControls: React.FC<LeadFilterControlsProps> = ({ filters, onFilterChange, isLoading }) => {

    // State to manage which filter menu is open (add new or edit existing)
    const [popoverState, setPopoverState] = useState<{
        view: 'fields' | 'edit';
        field: FilterFieldKey | null;
        anchorEl: HTMLElement | null;
    }>({ view: 'fields', field: null, anchorEl: null });

    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [savedFiltersAnchor, setSavedFiltersAnchor] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('funnel-saved-filters');
        if (stored) {
            setSavedFilters(JSON.parse(stored));
        }
    }, []);

    const { data: filterOptions } = useQuery<FilterOptions, Error>({
        queryKey: ['filterOptions'],
        queryFn: fetchFilterOptions,
        staleTime: Infinity,
    });

    const activeFilterCount =
        (filters.searchTerm ? 1 : 0) +
        filters.statuses.include.length + filters.statuses.exclude.length +
        filters.tags.include.length + filters.tags.exclude.length +
        filters.leadTypes.include.length + filters.leadTypes.exclude.length +
        filters.leadLevels.include.length + filters.leadLevels.exclude.length +
        filters.states.include.length + filters.states.exclude.length +
        (filters.dateAssignedDaysAgo.min !== null || filters.dateAssignedDaysAgo.max !== null ? 1 : 0) +
        (filters.lastContactedDaysAgo.min !== null || filters.lastContactedDaysAgo.max !== null ? 1 : 0);

    const isFilterActive = activeFilterCount > 0;

    const isCurrentFilterSaved = useMemo(() => {
        if (!isFilterActive) return false;
        const currentFiltersString = JSON.stringify(filters);
        return savedFilters.some(sf => JSON.stringify(sf.filters) === currentFiltersString);
    }, [filters, savedFilters, isFilterActive]);

    const handleListFilterChange = (field: Exclude<FilterFieldKey, 'dateAssignedDaysAgo' | 'lastContactedDaysAgo'>, value: FilterValue<string | number>) => {
        onFilterChange({
            ...filters,
            [field]: value,
        });
    };

    const getLabelForField = (field: FilterFieldKey) => ({
        statuses: "Status",
        tags: "Tags",
        leadTypes: "Lead Type",
        leadLevels: "Lead Level",
        states: "State",
        dateAssignedDaysAgo: "Date Assigned (Days Ago)",
        lastContactedDaysAgo: "Last Contacted (Days Ago)"
    }[field]);

    const openAddFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        setPopoverState({ view: 'fields', field: null, anchorEl: e.currentTarget });
    };

    const openEditFilter = (field: FilterFieldKey, e: React.MouseEvent<HTMLButtonElement>) => {
        setPopoverState({ view: 'edit', field, anchorEl: e.currentTarget });
    };

    const closePopover = () => {
        setPopoverState({ view: 'fields', field: null, anchorEl: null });
    };

    const handleSaveFilter = (name: string) => {
        const newSavedFilter: SavedFilter = {
            id: `filter_${Date.now()}`,
            name,
            filters: filters
        };
        const newFilters = [...savedFilters, newSavedFilter];
        setSavedFilters(newFilters);
        localStorage.setItem('funnel-saved-filters', JSON.stringify(newFilters));
        setIsSaveModalOpen(false);
    };

    const handleLoadFilter = (filterState: FilterState) => {
        onFilterChange(filterState);
        setSavedFiltersAnchor(null);
    };

    const handleDeleteFilter = (id: string) => {
        if(window.confirm("Are you sure you want to delete this saved filter?")) {
            const newFilters = savedFilters.filter(sf => sf.id !== id);
            setSavedFilters(newFilters);
            localStorage.setItem('funnel-saved-filters', JSON.stringify(newFilters));
        }
    };


    const popoverHeader = popoverState.view === 'fields'
        ? <h3 className="font-bold text-sm text-quility-dark-text">Filter by</h3>
        : (
            <div className="flex items-center gap-2">
                <button onClick={() => setPopoverState(p => ({ ...p, view: 'fields' }))} className="p-1 rounded-full hover:bg-quility-accent-bg">
                    <Icon name="q-chevron-left" size={16} />
                </button>
                <h3 className="font-bold text-sm text-quility-dark-text">{getLabelForField(popoverState.field!)}</h3>
            </div>
        );


    return (
        <>
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                    <button
                        onClick={openAddFilter}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-accent-bg"
                    >
                        <Icon name="sliders-q" size={16} />
                        Add Filter
                        {activeFilterCount > 0 && (
                            <span className="ml-1 bg-quility-dark-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {popoverState.anchorEl && (
                        <Popover onClose={closePopover} anchorEl={popoverState.anchorEl} headerContent={popoverHeader}>
                            {popoverState.view === 'fields' ? (
                                <FilterFieldSelector
                                    onFieldSelect={(field) => setPopoverState(p => ({ ...p, view: 'edit', field }))}
                                />
                            ) : popoverState.field === 'dateAssignedDaysAgo' ? (
                                <DaysAgoRangeFilterControl
                                    value={filters.dateAssignedDaysAgo}
                                    onChange={(value) => {
                                        onFilterChange({ ...filters, dateAssignedDaysAgo: value });
                                        closePopover();
                                    }}
                                />
                            ) : popoverState.field === 'lastContactedDaysAgo' ? (
                                <DaysAgoRangeFilterControl
                                    value={filters.lastContactedDaysAgo}
                                    onChange={(value) => {
                                        onFilterChange({ ...filters, lastContactedDaysAgo: value });
                                        closePopover();
                                    }}
                                />
                            ) : popoverState.field ? (
                                <ListFilterControl
                                    field={popoverState.field}
                                    value={filters[popoverState.field as keyof typeof filters] as any}
                                    onChange={(value) => handleListFilterChange(popoverState.field as any, value)}
                                />
                            ) : null}
                        </Popover>
                    )}
                </div>

                <div className="relative">
                    <OutlineButton
                        label="Saved Filters"
                        onClick={(e) => setSavedFiltersAnchor(e.currentTarget)}
                        rightContent={<Icon name="chevron-down" size={16} className="ml-2" />}
                        className="px-4 py-2 text-sm font-semibold rounded-md"
                    />
                    {savedFiltersAnchor && (
                        <Popover onClose={() => setSavedFiltersAnchor(null)} anchorEl={savedFiltersAnchor} headerContent="Load a Filter">
                            {savedFilters.length === 0 ? (
                                <div className="p-4 text-center text-sm text-quility-dark-grey">No saved filters.</div>
                            ) : (
                                <div className="py-1">
                                    {savedFilters.map(sf => (
                                        <div key={sf.id} className="flex items-center justify-between px-3 py-2 hover:bg-quility-light-hover group">
                                            <button onClick={() => handleLoadFilter(sf.filters)} className="text-left flex-grow">
                                                {sf.name}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFilter(sf.id)}
                                                className="p-1 rounded-full text-quility-dark-grey hover:bg-red-100 hover:text-quility-destructive opacity-0 group-hover:opacity-100"
                                                title="Delete Filter"
                                            >
                                                <Icon name="trash-q" size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Popover>
                    )}
                </div>

                {isFilterActive && !isCurrentFilterSaved && (
                    <PrimaryButton
                        label="Save Filter"
                        onClick={() => setIsSaveModalOpen(true)}
                        leftIcon="q-save"
                        className="px-4 py-2 text-sm font-semibold rounded-md animate-fade-in-scale"
                    />
                )}

                <LeadFilterPills
                    filters={filters}
                    onFilterChange={onFilterChange}
                    filterOptions={filterOptions}
                    onEdit={openEditFilter}
                    isLoading={isLoading}
                />
            </div>

            {isSaveModalOpen && (
                <SaveFilterModal
                    onClose={() => setIsSaveModalOpen(false)}
                    onSave={handleSaveFilter}
                />
            )}
        </>
    );
};

export default LeadFilterControls;
