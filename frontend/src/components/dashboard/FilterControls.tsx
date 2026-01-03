import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { FilterState, FilterOptions, FilterValue } from '../../types';
import Popover from '../common/Popover';
import FilterFieldSelector from './filter-popovers/FilterFieldSelector';
import LeadFilterPills from './LeadFilterPills';
import ListFilterControl from './filter-popovers/ListFilterControl';
import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../../utils/filter-api';

interface LeadFilterControlsProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

type FilterFieldKey = keyof Omit<FilterState, 'searchTerm' | 'dateAssigned' | 'lastContacted' | 'amountContacted'>;


const LeadFilterControls: React.FC<LeadFilterControlsProps> = ({ filters, onFilterChange }) => {
    const [editingFilter, setEditingFilter] = useState<{ field: FilterFieldKey, anchorEl: HTMLElement } | null>(null);

    // State to manage which filter menu is open (add new or edit existing)
    const [popoverState, setPopoverState] = useState<{
        view: 'fields' | 'edit';
        field: FilterFieldKey | null;
        anchorEl: HTMLElement | null;
    }>({ view: 'fields', field: null, anchorEl: null });


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
        filters.states.include.length + filters.states.exclude.length;

    const handleListFilterChange = (field: FilterFieldKey, value: FilterValue<string | number>) => {
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
        states: "State"
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
                        ) : popoverState.field ? (
                            <ListFilterControl
                                field={popoverState.field}
                                value={filters[popoverState.field]}
                                onChange={(value) => handleListFilterChange(popoverState.field!, value)}
                            />
                        ) : null}
                    </Popover>
                )}
            </div>

            <LeadFilterPills
                isLoading={true}
                filters={filters}
                onFilterChange={onFilterChange}
                filterOptions={filterOptions}
                onEdit={openEditFilter}
            />
        </div>
    );
};

export default LeadFilterControls;
