import React from 'react';
import type { RecruitingResource } from '../../types';
import Icon from '../common/Icon';

interface RecruitingResourceCardProps {
    resource: RecruitingResource;
    onPlay: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const RecruitingResourceCard: React.FC<RecruitingResourceCardProps> = ({ resource, onPlay, onEdit, onDelete }) => {
    const { title, description, category, thumbnailUrl, type } = resource;
    const actionText = type === 'video' ? 'Watch Video' : (type === 'document' ? 'Open Document' : 'View Script');
    const iconName = type === 'video' ? 'video' : (type === 'document' ? 'file-text' : 'script');
    
    return (
        <div className="bg-white border border-quility-border rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow h-full">
            <img src={thumbnailUrl} alt={title} className="h-40 w-full object-cover rounded-t-lg bg-quility-accent-bg" />
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-quility-dark-grey bg-quility-accent-bg px-2 py-1 rounded-full self-start">
                    {category}
                </span>
                <h3 className="font-bold text-quility-dark-text mt-2">{title}</h3>
                <p className="text-sm text-quility-dark-grey mt-1 flex-grow">
                    {description}
                </p>
            </div>
            <div className="border-t border-quility-border mt-auto p-2 flex justify-between items-center bg-quility-accent-bg rounded-b-lg">
                <button 
                    onClick={onPlay}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-quility hover:text-quility-dark-green"
                    title={actionText}
                >
                    <Icon name={iconName} size={16} />
                    {actionText}
                </button>
                <div className="flex gap-1">
                    <button onClick={onEdit} className="p-2 text-quility-dark-grey hover:text-quility rounded-full hover:bg-quility-light-hover" title="Edit">
                        <Icon name="q-pencil" size={18} />
                    </button>
                    <button onClick={onDelete} className="p-2 text-quility-dark-grey hover:text-quility-destructive rounded-full hover:bg-quility-light-hover" title="Delete">
                        <Icon name="trash-q" size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruitingResourceCard;