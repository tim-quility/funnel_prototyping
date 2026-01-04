import React from 'react';
import type { Recruit } from '../../types';
import Icon from '../common/Icon';

interface RecruitCardProps {
    recruit: Recruit;
    onDragStart: () => void;
    onClick: () => void;
}

const RecruitCard: React.FC<RecruitCardProps> = ({ recruit, onDragStart, onClick }) => {
    
    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'});
    }

    return (
        <div className="bg-white border border-quility-border rounded-lg p-3 flex gap-2">
            <div
                draggable
                onDragStart={onDragStart}
                className="cursor-grab active:cursor-grabbing p-1 text-quility-dark-grey/40 hover:text-quility-dark-grey flex items-start pt-1"
            >
                <Icon name="grip-vertical" size={20} />
            </div>

            <button onClick={onClick} className="text-left w-full">
                <p className="font-bold text-quility-dark-text">{recruit.name}</p>
                <div className="mt-2 space-y-1 text-xs text-quility-dark-grey">
                     <div className="flex items-center gap-2">
                        <Icon name="calendar-q" size={14} />
                        <span>Applied: {formatDate(recruit.applyDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon name="link-q" size={14} />
                        <span>Source: {recruit.source}</span>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default RecruitCard;