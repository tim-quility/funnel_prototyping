
import React from 'react';
import Icon from '../../common/Icon';

type FilterFieldKey = 'statuses' | 'tags' | 'leadTypes' | 'leadLevels' | 'states' | 'dateAssignedDaysAgo' | 'lastContactedDaysAgo';

interface FilterFieldSelectorProps {
    onFieldSelect: (field: FilterFieldKey) => void;
}

const filterFields: { id: FilterFieldKey, label: string, icon: string, description: string }[] = [
    { id: 'statuses', label: 'Status', icon: 'q-stats', description: 'Filter by lead status like New, Contacted, etc.' },
    { id: 'tags', label: 'Tags', icon: 'tag', description: 'Find leads with specific tags like Hot or VIP.' },
    { id: 'dateAssignedDaysAgo', label: 'Date Assigned (Days Ago)', icon: 'calendar-clock', description: 'Filter by days since assignment' },
    { id: 'lastContactedDaysAgo', label: 'Last Contacted (Days Ago)', icon: 'clock', description: 'Filter by days since last contact.' },
    { id: 'leadTypes', label: 'Lead Type', icon: 'file-text-q', description: 'Filter by how the lead was acquired.' },
    { id: 'leadLevels', label: 'Lead Level', icon: 'activity-q', description: 'Filter by lead temperature like Hot, Warm, Cold.' },
    { id: 'states', label: 'State', icon: 'q-map-pin', description: 'Find leads in specific US states.' },
];

const FilterFieldSelector: React.FC<FilterFieldSelectorProps> = ({ onFieldSelect }) => {
    return (
        <div className="space-y-1">
            {filterFields.map(field => (
                <button
                    key={field.id}
                    onClick={() => onFieldSelect(field.id)}
                    className="w-full p-2 text-left flex gap-3 items-center rounded-md hover:bg-quility-light-hover transition-all duration-200 transform hover:scale-103"
                >
                    <div className="w-10 h-10 flex-shrink-0 bg-quility-light-green rounded-lg flex items-center justify-center">
                        <Icon name={field.icon} size={22} className="text-quility-dark-green" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-quility-dark-text">{field.label}</h4>
                        <p className="text-xs text-quility-dark-grey">{field.description}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default FilterFieldSelector;
