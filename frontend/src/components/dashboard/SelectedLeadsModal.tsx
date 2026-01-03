
import React from 'react';
import Icon from '../common/Icon';
import type { Lead } from '../../types';
import Avatar from '../common/Avatar';
import PrimaryButton from '../common/PrimaryButton'; // Import PrimaryButton
import OutlineButton from '../common/OutlineButton'; // Import OutlineButton

interface SelectedLeadsModalProps {
    selectedLeads: Map<string, Lead>;
    setSelectedLeads: React.Dispatch<React.SetStateAction<Map<string, Lead>>>;
    onClose: () => void;
    onClearAllSelection: () => void;
}

const SelectedLeadsModal: React.FC<SelectedLeadsModalProps> = ({ selectedLeads, setSelectedLeads, onClose, onClearAllSelection }) => {
    const leadsToShow = Array.from(selectedLeads.values());
    const selectedCount = selectedLeads.size;

    const handleRemoveLead = (leadId: string) => {
        setSelectedLeads(prev => {
            const newMap = new Map(prev);
            newMap.delete(leadId);
            return newMap;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col relative animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b border-quility-border flex justify-between items-center bg-quility-accent-bg rounded-t-lg">
                    <h2 className="text-xl font-bold text-quility-dark-text">Selected Leads ({selectedCount})</h2>
                    <button onClick={onClose} className="p-1 text-quility-dark-grey hover:text-quility-destructive">
                        <Icon name="x-close-q" size={20} />
                    </button>
                </header>

                <main className="flex-grow overflow-y-auto p-4">
                    {leadsToShow.length > 0 ? (
                        <div className="space-y-3">
                            {leadsToShow.map(lead => (
                                <div key={lead.lead_id} className="flex items-center justify-between bg-quility-light-hover p-3 rounded-md border border-quility-border">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={lead.name} avatarUrl={lead.avatarUrl} size={32} />
                                        <div>
                                            <p className="font-semibold text-quility-dark-text">{lead.name}</p>
                                            <p className="text-xs text-quility-dark-grey">{lead.company}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveLead(lead.lead_id)}
                                        className="p-1.5 text-quility-destructive hover:text-red-700"
                                        title="Remove from selection"
                                    >
                                        <Icon name="trash-q" size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-quility-dark-grey">
                            No leads currently selected.
                        </div>
                    )}
                </main>

                <footer className="flex-shrink-0 p-4 border-t border-quility-border flex justify-between items-center bg-quility-accent-bg rounded-b-lg">
                    {selectedCount > 0 ? (
                        <OutlineButton onClick={onClearAllSelection} label="Clear All Selection" leftIcon="trash-q" />
                    ) : (
                        <div /> // Empty div to keep spacing consistent if no items
                    )}
                    <PrimaryButton
                        onClick={onClose}
                        label="Close"
                    />
                </footer>
            </div>
        </div>
    );
};

export default SelectedLeadsModal;
