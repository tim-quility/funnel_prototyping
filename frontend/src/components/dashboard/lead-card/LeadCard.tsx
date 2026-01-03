// Mock LeadCard
import React from 'react';
import type { Lead } from '../../../types';

interface LeadCardProps {
    lead: Lead;
    onBack: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onBack }) => {
    return (
        <div className="p-4">
            <button onClick={onBack} className="mb-4 text-blue-500 underline">Back</button>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <p>Lead Details Placeholder</p>
        </div>
    );
};

export default LeadCard;
