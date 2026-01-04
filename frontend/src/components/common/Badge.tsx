import React from 'react';
import type { Badge as BadgeType } from '../../types';
import Icon from '../common/Icon';

interface BadgeProps {
    badge: BadgeType;
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
    return (
        <div className={`p-4 rounded-lg border text-center transition-all duration-300 ${badge.earned ? 'bg-quility-light-green border-quility-dark-green/30' : 'bg-quility-accent-bg border-quility-border'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${badge.earned ? 'bg-quility' : 'bg-gray-300'}`}>
                <Icon name={badge.icon} size={40} className={badge.earned ? 'text-white' : 'text-gray-500'} />
            </div>
            <h3 className={`mt-4 font-bold ${badge.earned ? 'text-quility-dark-green' : 'text-quility-dark-text'}`}>{badge.name}</h3>
            <p className={`mt-1 text-xs ${badge.earned ? 'text-quility-dark-text' : 'text-quility-dark-grey'}`}>{badge.description}</p>
        </div>
    );
};

export default Badge;