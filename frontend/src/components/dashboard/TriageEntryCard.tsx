import React from 'react';
import Icon from '../common/Icon';

interface TriageEntryCardProps {
    count: number;
    onClick: () => void;
}

const TriageEntryCard: React.FC<TriageEntryCardProps> = ({ count, onClick }) => {
    if (count === 0) return null;

    return (
        <div
            onClick={onClick}
            className="bg-quility-light-green border-2 border-dashed border-quility-dark-green rounded-lg p-6 text-center cursor-pointer hover:bg-quility-light-hover hover:border-quility-dark-green transition-all"
        >
            <Icon name="user-03" size={32} className="text-quility-dark-green mx-auto" />
            <p className="mt-3 text-2xl font-bold text-quility-dark-text">
                You have {count} contacts ready for triage.
            </p>
            <p className="mt-1 text-sm text-quility-dark-green font-semibold">
                Click here to start categorizing
            </p>
        </div>
    );
};

export default TriageEntryCard;