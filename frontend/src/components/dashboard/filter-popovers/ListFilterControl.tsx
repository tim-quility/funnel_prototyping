import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../../../utils/filter-api';
import Icon from '../../common/Icon';
import type { FilterValue } from '../../../types';
import TriStateButton from './TriStateButton';
import Tooltip from '../../common/Tooltip';

type FilterFieldKey = 'statuses' | 'tags' | 'leadTypes' | 'leadLevels' | 'states';

interface ListFilterControlProps {
    field: FilterFieldKey;
    value: FilterValue<string | number>;
    onChange: (value: FilterValue<string | number>) => void;
}

const ListFilterControl: React.FC<ListFilterControlProps> = ({ field, value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: filterOptions, isLoading } = useQuery({
        queryKey: ['filterOptions'],
        queryFn: fetchFilterOptions,
        staleTime: Infinity,
    });

    const options = useMemo(() => {
        if (!filterOptions) return [];
        return filterOptions[field] || [];
    }, [filterOptions, field]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [options, searchTerm]);

    const handleToggle = (id: string | number) => {
        const currentlyIncluded = value.include.includes(id);
        const currentlyExcluded = value.exclude.includes(id);

        let newInclude = [...value.include];
        let newExclude = [...value.exclude];

        if (currentlyIncluded) { // Cycle from Include to Exclude
            newInclude = newInclude.filter(i => i !== id);
            newExclude.push(id);
        } else if (currentlyExcluded) { // Cycle from Exclude to Off
            newExclude = newExclude.filter(e => e !== id);
        } else { // Cycle from Off to Include
            newInclude.push(id);
        }

        onChange({ include: newInclude, exclude: newExclude });
    };

    const getItemState = (id: string | number): 'include' | 'exclude' | 'off' => {
        if (value.include.includes(id)) return 'include';
        if (value.exclude.includes(id)) return 'exclude';
        return 'off';
    }

    const tooltipContent = "Click an item to cycle its state: ✅ Include → ❌ Exclude → ⬜ Off";

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xs font-bold uppercase text-quility-dark-grey">Select Options</h4>
                <Tooltip content={tooltipContent}>
                    <Icon name="alert-triangle" size={14} className="text-quility-dark-grey" />
                </Tooltip>
            </div>
             <div className="relative">
                <Icon name="q-search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-quility-dark-grey" />
                <input
                    type="text"
                    placeholder={`Search ${field}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-8 pl-8 pr-2 text-sm border rounded-md bg-quility-input-bg border-quility-border"
                />
            </div>
            {isLoading ? <p className="text-sm text-quility-dark-grey p-2">Loading...</p> : (
                <>
                    <div className="max-h-52 overflow-y-auto">
                        {filteredOptions.map(opt => (
                            <TriStateButton
                                key={opt.id}
                                state={getItemState(opt.id)}
                                onClick={() => handleToggle(opt.id)}
                            >
                                {opt.name}
                            </TriStateButton>
                        ))}
                    </div>
                     <button
                        onClick={() => onChange({ include: [], exclude: [] })}
                        className="w-full text-center p-1.5 text-sm font-semibold text-quility-dark-grey hover:bg-quility-accent-bg rounded-md"
                        disabled={value.include.length === 0 && value.exclude.length === 0}
                    >
                        Clear
                    </button>
                </>
            )}
        </div>
    );
};

export default ListFilterControl;
