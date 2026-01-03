
import React from 'react';
import Icon from '../common/Icon';
import type { FilterState, FilterOptions } from '../../types';
import Tooltip from '../common/Tooltip';

interface LeadFilterPillsProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    filterOptions: FilterOptions | undefined;
    onEdit: (field: keyof Omit<FilterState, 'searchTerm' | 'dateAssigned' | 'lastContacted' | 'amountContacted' | 'dateAssignedDaysAgo' | 'lastContactedDaysAgo'> | 'dateAssignedDaysAgo' | 'lastContactedDaysAgo', e: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading: boolean;
}

const Pill: React.FC<{
    label: string;
    modeIcon: string;
    modeColor: string;
    tooltipContent: string;
    onIconClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onTextClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ label, modeIcon, modeColor, tooltipContent, onIconClick, onTextClick, onRemove }) => (
    <div className="flex items-center gap-1.5 rounded-full pl-1 pr-1 py-1 text-sm font-semibold bg-quility-accent-bg border border-quility-border text-quility-dark-text animate-fade-in-scale">
        <Tooltip content={tooltipContent}>
            <button onClick={onIconClick} className={`p-1 rounded-full hover:bg-black/10 ${modeColor}`}>
                <Icon name={modeIcon} size={14} />
            </button>
        </Tooltip>
        <button onClick={onTextClick} className="hover:underline pr-1">
            <span>{label}</span>
        </button>
        <button
            onClick={(e) => { e.stopPropagation(); onRemove(e); }}
            className="p-0.5 rounded-full hover:bg-black/10"
            title="Remove filter"
        >
            <Icon name="x-close-q" size={14} />
        </button>
    </div>
);

const LeadFilterPills: React.FC<LeadFilterPillsProps> = ({ filters, onFilterChange, filterOptions, onEdit, isLoading }) => {
    type FilterFieldKey = keyof Omit<FilterState, 'searchTerm' | 'dateAssigned' | 'lastContacted' | 'amountContacted' | 'dateAssignedDaysAgo' | 'lastContactedDaysAgo'>;

    const activeFilters: {
        key: string;
        label: string;
        modeIcon: string;
        modeColor: string;
        tooltipContent: string;
        onIconClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
        onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
        onTextClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }[] = [];

    // Search Term Pill (no toggle)
    if (filters.searchTerm) {
        activeFilters.push({
            key: 'searchTerm',
            label: `Search: "${filters.searchTerm}"`,
            modeIcon: 'q-search',
            modeColor: 'text-gray-500',
            tooltipContent: 'Search term filter',
            onIconClick: () => {}, // No action for search icon click
            onRemove: () => onFilterChange({ ...filters, searchTerm: '' }),
            onTextClick: () => {}, // No action for search text click
        });
    }

    // List-based Pills
    (['statuses', 'tags', 'leadTypes', 'leadLevels', 'states'] as const).forEach((key: FilterFieldKey) => {
        const filterItem = filters[key];
        const hasIncludes = filterItem.include.length > 0;
        const hasExcludes = filterItem.exclude.length > 0;

        if (hasIncludes || hasExcludes) {
            // Explicitly define the tuple type for Map constructor
            const optionsMap = new Map<string | number, string>((filterOptions?.[key] || []).map(opt => [opt.id, opt.name] as const));

            let labelParts: string[] = [];
            if(hasIncludes) {
                const firstLabel = optionsMap.get(filterItem.include[0]) || String(filterItem.include[0]);
                labelParts.push(`+${firstLabel}${filterItem.include.length > 1 ? `, +${filterItem.include.length-1}` : ''}`);
            }
            if(hasExcludes) {
                const firstLabel = optionsMap.get(filterItem.exclude[0]) || String(filterItem.exclude[0]);
                labelParts.push(`-${firstLabel}${filterItem.exclude.length > 1 ? `, +${filterItem.exclude.length-1}` : ''}`);
            }

            const labelPrefix = { statuses: "Status: ", tags: "Tags: ", leadTypes: "Type: ", leadLevels: "Level: ", states: "State: " }[key];
            const fullLabel = labelPrefix + labelParts.join(' ');

            const isIncludeOnly = hasIncludes && !hasExcludes;
            const isExcludeOnly = !hasIncludes && hasExcludes;

            const modeIcon = isIncludeOnly ? 'checkmark-q' : isExcludeOnly ? 'math-minus-q' : 'q-pencil';
            const modeColor = isIncludeOnly ? 'text-green-600' : isExcludeOnly ? 'text-red-600' : 'text-gray-500';
            const tooltipContent = isIncludeOnly
                ? "Include only. Click to switch to Exclude."
                : isExcludeOnly
                ? "Exclude only. Click to switch to Include."
                : "Mixed filter. Click text to edit for granular control.";


            const handleIconClick = () => {
                if (isIncludeOnly) { // Toggle from include to exclude
                    onFilterChange({ ...filters, [key]: { include: [], exclude: filterItem.include } });
                } else if (isExcludeOnly) { // Toggle from exclude to include
                    onFilterChange({ ...filters, [key]: { include: filterItem.exclude, exclude: [] } });
                }
                // If mixed state, do nothing on icon click, user must use the editor.
            };

            activeFilters.push({
                key: key,
                label: fullLabel,
                modeIcon,
                modeColor,
                tooltipContent,
                onIconClick: handleIconClick,
                onRemove: () => onFilterChange({ ...filters, [key]: { include: [], exclude: [] } }),
                onTextClick: (e) => onEdit(key, e),
            });
        }
    });

    // Date Assigned (Days Ago) Pill
    if (filters.dateAssignedDaysAgo.min !== null || filters.dateAssignedDaysAgo.max !== null) {
        const { min, max } = filters.dateAssignedDaysAgo;
        let label = 'Assigned: ';
        if (min !== null && max !== null) {
            if (min === max) {
                label += `${min} days ago`;
            } else {
                label += `between ${min} and ${max} days ago`;
            }
        } else if (min !== null) {
            label += `at least ${min} days ago`;
        } else if (max !== null) {
            label += `within last ${max === 0 ? '0' : max} days`;
        }

        activeFilters.push({
            key: 'dateAssignedDaysAgo',
            label,
            modeIcon: 'calendar-clock',
            modeColor: 'text-gray-500',
            tooltipContent: 'Filter by when lead was assigned',
            onIconClick: (e) => onEdit('dateAssignedDaysAgo', e),
            onRemove: () => onFilterChange({ ...filters, dateAssignedDaysAgo: { min: null, max: null } }),
            onTextClick: (e) => onEdit('dateAssignedDaysAgo', e),
        });
    }

    // Last Contacted (Days Ago) Pill
    if (filters.lastContactedDaysAgo.min !== null || filters.lastContactedDaysAgo.max !== null) {
        const { min, max } = filters.lastContactedDaysAgo;
        let label = 'Last Contacted: ';
        if (min !== null && max !== null) {
            if (min === max) {
                label += `${min} days ago`;
            } else {
                label += `between ${min} and ${max} days ago`;
            }
        } else if (min !== null) {
            label += `at least ${min} days ago`;
        } else if (max !== null) {
            label += `within last ${max === 0 ? '0' : max} days`;
        }

        activeFilters.push({
            key: 'lastContactedDaysAgo',
            label,
            modeIcon: 'clock',
            modeColor: 'text-gray-500',
            tooltipContent: 'Filter by when lead was last contacted',
            onIconClick: (e) => onEdit('lastContactedDaysAgo', e),
            onRemove: () => onFilterChange({ ...filters, lastContactedDaysAgo: { min: null, max: null } }),
            onTextClick: (e) => onEdit('lastContactedDaysAgo', e),
        });
    }

    const clearAllFilters = () => {
        onFilterChange({
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
    };

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <>
            <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s ease-out forwards;
                }
            `}</style>
            <div className="flex-grow flex items-center gap-2 flex-wrap">
                {activeFilters.map(filter => (
                    <Pill
                        key={filter.key}
                        label={filter.label}
                        modeIcon={filter.modeIcon}
                        modeColor={filter.modeColor}
                        tooltipContent={filter.tooltipContent}
                        onIconClick={filter.onIconClick}
                        onRemove={filter.onRemove}
                        onTextClick={filter.onTextClick}
                    />
                ))}
                <button onClick={clearAllFilters} className="text-sm font-semibold text-quility-dark-grey hover:underline">
                    Clear all
                </button>
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-quility/50 border-t-quility rounded-full animate-spin"></div>
                )}
            </div>
        </>
    );
};

export default LeadFilterPills;
