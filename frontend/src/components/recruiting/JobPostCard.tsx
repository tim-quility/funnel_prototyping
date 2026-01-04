import React from 'react';
import type { JobPostTemplate } from '../../types';
import Icon from '../common/Icon';

interface JobPostCardProps {
    template: JobPostTemplate;
    onEdit: () => void;
    onDelete: () => void;
}

const JobPostCard: React.FC<JobPostCardProps> = ({ template, onEdit, onDelete }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(template.content);
        alert('Content copied to clipboard!');
    };
    
    return (
        <div className="bg-white border border-quility-border rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow h-full">
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-quility-dark-text mb-2 pr-2">{template.title}</h3>
                <p className="text-sm text-quility-dark-grey flex-grow">
                    {template.content.length > 150 ? `${template.content.substring(0, 150)}...` : template.content}
                </p>
                <p className="text-xs text-quility-dark-grey mt-3">
                    Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
                </p>
            </div>
            <div className="border-t border-quility-border mt-auto p-2 flex justify-end gap-1 bg-quility-accent-bg rounded-b-lg">
                <button onClick={handleCopy} className="p-2 text-quility-dark-grey hover:text-quility rounded-full hover:bg-quility-light-hover" title="Copy Content">
                    <Icon name="copy-q" size={18} />
                </button>
                <button onClick={onEdit} className="p-2 text-quility-dark-grey hover:text-quility rounded-full hover:bg-quility-light-hover" title="Edit">
                    <Icon name="q-pencil" size={18} />
                </button>
                <button onClick={onDelete} className="p-2 text-quility-dark-grey hover:text-quility-destructive rounded-full hover:bg-quility-light-hover" title="Delete">
                    <Icon name="trash-q" size={18} />
                </button>
            </div>
        </div>
    );
};

export default JobPostCard;
