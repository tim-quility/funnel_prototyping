import React from 'react';
import Icon from '../common/Icon';
import type { Lead } from '../../types';
import Avatar from '../common/Avatar';

interface LeadDetailModalProps {
    lead: Lead;
    onClose: () => void;
}

const InfoRow: React.FC<{ icon: string; label: string; value?: string | null }> = ({ icon, label, value }) => (
    <div>
        <div className="flex items-center gap-2 text-sm text-quility-dark-grey">
            <Icon name={icon} size={16} />
            <span>{label}</span>
        </div>
        <p className="mt-1 font-semibold text-quility-dark-text">{value || 'N/A'}</p>
    </div>
);

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-quility-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar name={lead.name} avatarUrl={lead.avatarUrl} size={40} />
                        <div>
                            <h2 className="text-xl font-bold text-quility-dark-text">{lead.name}</h2>
                            <p className="text-sm text-quility-dark-grey">{lead.company}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-quility-accent-bg rounded-full">
                        <Icon name="x-close-q" size={24} className="text-quility-dark-grey" />
                    </button>
                </header>

                <main className="flex-grow flex overflow-hidden">
                    {/* Left Panel: Main Info & Activity */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <InfoRow icon="q-email" label="Email" value={lead.email} />
                            <InfoRow icon="q-phone-call" label="Phone" value={lead.phone} />
                            <InfoRow icon="q-map-pin" label="State" value={lead.state} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <InfoRow icon="q-stats" label="Status" value={lead.status} />
                             <InfoRow icon="q-leads" label="Value" value={`$${lead.value?.toLocaleString()}`} />
                        </div>
                         <div className="border-t pt-4">
                            <h3 className="font-bold text-quility-dark-text mb-3">Activity Feed (Placeholder)</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-quility-dark-grey">Call logged - Left voicemail - 2 days ago</p>
                                <p className="text-sm text-quility-dark-grey">Email sent: "Following up" - 3 days ago</p>
                                <p className="text-sm text-quility-dark-grey">Status changed to 'Contacted' - 3 days ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Notes & Tasks */}
                    <div className="w-1/3 bg-quility-accent-bg border-l border-quility-border p-4 flex flex-col">
                         <h3 className="font-bold text-quility-dark-text mb-3">Notes</h3>
                         <div className="flex-grow bg-white rounded border p-2 mb-4 text-sm text-quility-dark-grey">
                            Placeholder for notes...
                         </div>
                         <textarea placeholder="Add a new note..." rows={3} className="w-full p-2 text-sm border rounded" />
                         <button className="mt-2 w-full h-9 text-sm font-bold bg-quility-button text-white rounded">Add Note</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LeadDetailModal;
