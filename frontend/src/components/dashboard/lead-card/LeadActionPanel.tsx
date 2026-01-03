
import React, { useState } from 'react';
import type { Lead } from '../../../types';
import Icon from '../../common/Icon';

// Import action tabs
import ScriptTab from './tabs/ScriptTab';
import TextTab from './tabs/TextTab';
import EmailTab from './tabs/EmailTab';
import NotesTab from './tabs/NotesTab';
import QuotesTab from './tabs/QuotesTab';

interface LeadActionPanelProps {
    lead: Lead;
}

type ActionTab = 'script' | 'text' | 'email' | 'notes' | 'quotes';

const LeadActionPanel: React.FC<LeadActionPanelProps> = ({ lead }) => {
    const [activeActionTab, setActiveActionTab] = useState<ActionTab>('text');

    const renderActionContent = () => {
        switch (activeActionTab) {
            case 'script':
                return <ScriptTab lead={lead} />;
            case 'text':
                return <TextTab lead={lead} />;
            case 'email':
                return <EmailTab lead={lead} />;
            case 'notes':
                return <NotesTab lead={lead} />;
            case 'quotes':
                return <QuotesTab lead={lead} />;
            default:
                return (
                    <div className="p-4 text-center text-quility-dark-grey">
                        <p>Select an action above.</p>
                    </div>
                );
        }
    };

    const ActionTabButton: React.FC<{ tabId: ActionTab; label: string; icon: string; }> = ({ tabId, label, icon }) => (
        <button
            onClick={() => setActiveActionTab(tabId)}
            className={`flex-grow flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors
                ${activeActionTab === tabId
                    ? 'bg-white text-quility-dark-text shadow-sm'
                    : 'text-quility-dark-grey hover:bg-white/70 hover:text-quility-dark-text'
                }`}
        >
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-shrink-0 border-b border-quility-border p-1 bg-quility-accent-bg">
                <nav className="flex gap-1" aria-label="Action Tabs">
                    <ActionTabButton tabId="script" label="Scripts" icon="script" />
                    <ActionTabButton tabId="text" label="Text" icon="message-circle-q" />
                    <ActionTabButton tabId="email" label="Email" icon="q-email" />
                    <ActionTabButton tabId="notes" label="Notes" icon="q-pencil" />
                    <ActionTabButton tabId="quotes" label="Quotes" icon="receipt" />
                </nav>
            </div>
            <div className="flex-grow overflow-hidden flex flex-col">
                {renderActionContent()}
            </div>
        </div>
    );
};

export default LeadActionPanel;
