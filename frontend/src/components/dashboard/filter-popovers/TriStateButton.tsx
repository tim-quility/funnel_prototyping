import React from 'react';
import Icon from '../../common/Icon';

type State = 'include' | 'exclude' | 'off';

interface TriStateButtonProps {
    state: State;
    onClick: () => void;
    children: React.ReactNode;
}

const TriStateButton: React.FC<TriStateButtonProps> = ({ state, onClick, children }) => {
    const stateConfig = {
        include: { icon: 'checkmark-q', color: 'text-green-600', bg: 'bg-green-100/50', label: 'Including' },
        exclude: { icon: 'math-minus-q', color: 'text-red-600', bg: 'bg-red-100/50', label: 'Excluding' },
        off: { icon: 'square-q', color: 'text-gray-400', bg: 'hover:bg-gray-100', label: '' },
    };

    const config = stateConfig[state];

    return (
        <label
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${config.bg}`}
            onClick={(e) => { e.preventDefault(); onClick(); }} // Prevent label's default checkbox behavior
            title={`Click to change filter mode. Current: ${config.label}`}
        >
            <div className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${config.color}`}>
                <Icon name={config.icon} size={18} />
            </div>
            <span className="text-sm font-medium text-quility-dark-text">{children}</span>
        </label>
    );
};

export default TriStateButton;