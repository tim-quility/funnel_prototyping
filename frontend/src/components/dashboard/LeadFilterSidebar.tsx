import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { FilterState, FilterOptions } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../../utils/filter-api';

interface LeadFilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const LeadFilterSidebar: React.FC<LeadFilterSidebarProps> = ({ filters, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(true);

    const { data: filterOptions, isLoading } = useQuery<FilterOptions, Error>({
        queryKey: ['filterOptions'],
        queryFn: fetchFilterOptions,
        staleTime: Infinity, // These options don't change often
    });

    const handleStatusToggle = (statusId: number) => {
        const newIncludes = filters.statuses.include.includes(statusId)
            ? filters.statuses.include.filter(s => s !== statusId)
            : [...filters.statuses.include, statusId];
        onFilterChange({ ...filters, statuses: { ...filters.statuses, include: newIncludes } });
    };

    const handleTagToggle = (tagId: string) => {
        const newIncludes = filters.tags.include.includes(tagId)
            ? filters.tags.include.filter(t => t !== tagId)
            : [...filters.tags.include, tagId];
        onFilterChange({ ...filters, tags: { ...filters.tags, include: newIncludes } });
    };

    const handleClearFilters = () => {
        onFilterChange({
            searchTerm: '',
            statuses: { include: [], exclude: [] },
            tags: { include: [], exclude: [] },
            dateAssigned: { start: null, end: null },
            lastContacted: { start: null, end: null },
            amountContacted: { min: null, max: null },
            leadTypes: { include: [], exclude: [] },
            leadLevels: { include: [], exclude: [] },
            states: { include: [], exclude: [] },
        });
    };

    if (!isOpen) {
        return (
            <div className="w-12 bg-quility-accent-bg border-l border-quility-border flex-shrink-0 p-2">
                <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-quility-border rounded-md">
                    <Icon name="sliders-q" size={20} className="text-quility-dark-grey" />
                </button>
            </div>
        );
    }

    return (
        <aside className="w-72 bg-quility-accent-bg border-l border-quility-border flex-shrink-0 flex flex-col h-full">
            <div className="p-4 flex justify-between items-center border-b border-quility-border">
                <h2 className="font-bold text-quility-dark-text">Filters</h2>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-quility-border rounded-md">
                    <Icon name="q-chevron-right" size={20} className="text-quility-dark-grey" />
                </button>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                <div>
                    <label className="text-xs font-bold uppercase text-quility-dark-grey">Search</label>
                    <input
                        type="text"
                        placeholder="Name, email, etc..."
                        value={filters.searchTerm}
                        onChange={e => onFilterChange({ ...filters, searchTerm: e.target.value })}
                        className="w-full h-9 mt-1 px-3 text-sm border rounded-md bg-white border-quility-border"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-quility-dark-grey">Status</label>
                    <div className="mt-2 space-y-1">
                        {isLoading ? <p className="text-sm text-quility-dark-grey">Loading...</p> :
                         filterOptions?.statuses.map(status => (
                            <label key={status.id} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={filters.statuses.include.includes(status.id)} onChange={() => handleStatusToggle(status.id)} className="h-4 w-4 rounded text-quility focus:ring-quility" />
                                {status.name}
                            </label>
                         ))
                        }
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-bold uppercase text-quility-dark-grey">Tags</label>
                    <div className="mt-2 space-y-1">
                        {isLoading ? <p className="text-sm text-quility-dark-grey">Loading...</p> :
                         filterOptions?.tags.map(tag => (
                            <label key={tag.id} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={filters.tags.include.includes(tag.id)} onChange={() => handleTagToggle(tag.id)} className="h-4 w-4 rounded text-quility focus:ring-quility" />
                                {tag.name}
                            </label>
                         ))
                        }
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-quility-border flex-shrink-0">
                <button onClick={handleClearFilters} className="w-full h-9 text-sm font-bold text-quility-dark-text bg-white border border-quility-border rounded-md hover:bg-quility-hover-grey">
                    Clear All Filters
                </button>
            </div>
        </aside>
    );
};

export default LeadFilterSidebar;
