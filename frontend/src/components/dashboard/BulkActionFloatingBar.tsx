
import React, { useState, useCallback, useRef } from 'react';
import Icon from '../common/Icon';
import SelectedLeadsModal from './SelectedLeadsModal';
import type { Lead, DialSessionConfig, DialSessionLead } from '../../types';
import DialSessionSetupModal from '../dialer/DialSessionSetupModal';
import { useDialer } from '../../context/DialerContext';

// New imports for bulk action modals
import BulkAddWorkflowModal from './bulk-actions/BulkAddWorkflowModal';
import BulkAddTagModal from './bulk-actions/BulkAddTagModal';
import BulkChangeStatusModal from './bulk-actions/BulkChangeStatusModal';
import BulkSendTextModal from './bulk-actions/BulkSendTextModal';
import BulkAiToggleModal from './bulk-actions/BulkAiToggleModal'; // Import new modal
import Toast from '../common/Toast';
import Tooltip from '../common/Tooltip';

interface BulkActionFloatingBarProps {
    selectedLeads: Map<string, Lead>;
    setSelectedLeads: React.Dispatch<React.SetStateAction<Map<string, Lead>>>;
    onViewLead: (lead: Lead) => void;
}

type ModalType = 'workflow' | 'tag' | 'status' | 'text' | 'dial' | 'view' | 'ai'; // Added 'ai'

const ActionButton: React.FC<{ onClick: () => void; icon: string; label: string }> = ({ onClick, icon, label }) => (
    <Tooltip content={label}>
        <button
            onClick={onClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-quility-border text-quility-dark-grey hover:bg-quility-light-hover hover:border-quility-button hover:text-quility-button transition-all duration-200"
            aria-label={label}
        >
            <Icon name={icon} size={20} />
        </button>
    </Tooltip>
);


export const BulkActionFloatingBar: React.FC<BulkActionFloatingBarProps> = ({
    selectedLeads,
    setSelectedLeads,
    onViewLead,
}) => {
    const selectedCount = selectedLeads.size;
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { startSession } = useDialer();

    // State for draggability
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragRef = useRef<{ startX: number, startY: number, startPos: { x: number, y: number } } | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPos: position,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setPosition({
            x: dragRef.current.startPos.x + dx,
            y: dragRef.current.startPos.y + dy,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        dragRef.current = null;
    }, [handleMouseMove]);


    const handleSuccess = (message: string) => {
        setToastMessage(message);
        setSelectedLeads(new Map()); // Clear selection on success
    };

    const handleClearAllSelection = () => {
        setSelectedLeads(new Map());
        setActiveModal(null);
    };

    const handleStartDialSession = (config: DialSessionConfig) => {
        const leadsForSession: DialSessionLead[] = Array.from(selectedLeads.values()).map((lead): DialSessionLead | null => {
            if (!lead || !lead.phone) return null;
            return {
                leadId: lead.id,
                agent_id:lead.agent_id,
                name: lead.name,
                phone: lead.phone,
                dialAttempts: 0,
                status: lead.status,
                firstName: lead.borrower_first,
                lastName: lead.borrower_last,
                email: lead.email,
                leadType: lead.lead_type,
                leadLevel: lead.lead_level,
            };
        }).filter((l): l is DialSessionLead => l !== null);

        if (leadsForSession.length > 0) {
            startSession(leadsForSession, config);
            setActiveModal(null);
            setSelectedLeads(new Map());
        } else {
            alert('No valid leads with phone numbers selected for the dial session.');
        }
    };

    const leadIdsArray = Array.from(selectedLeads.keys());
    const selectedLeadsList = Array.from(selectedLeads.values());

    return (
        <>
            <div
                style={{
                    transform: `translateX(calc(-50% + ${position.x}px)) translateY(${position.y}px)`
                }}
                className={`fixed bottom-4 left-1/2 z-20 bg-quility-block-bg border border-quility-border shadow-2xl rounded-full py-2 px-3 flex items-center gap-3 transition-opacity duration-300 ease-out
                ${selectedCount > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="font-bold text-quility-dark-text pr-3 pl-2">
                    {selectedCount} Selected
                </div>

                {/* Drag Handle */}
                <div
                    onMouseDown={handleMouseDown}
                    className="cursor-move px-2 text-quility-border hover:text-quility-dark-grey transition-colors border-l border-r h-full flex items-center"
                    title="Drag to move"
                >
                    <Icon name="grip-vertical" size={24} />
                </div>

                <div className="flex items-center gap-3">
                    <ActionButton onClick={() => setActiveModal('view')} icon="q-list" label="View Selected" />
                    <ActionButton onClick={() => setActiveModal('dial')} icon="q-phone-call" label="Start Dial Session" />
                    <ActionButton onClick={() => setActiveModal('text')} icon="message-circle-q" label="Send Bulk Text" />
                    <ActionButton onClick={() => setActiveModal('ai')} icon="brain" label="Toggle AI Assistant" /> {/* New Button */}
                    <ActionButton onClick={() => setActiveModal('workflow')} icon="shuffle-q" label="Add to Workflow" />
                    <ActionButton onClick={() => setActiveModal('tag')} icon="tag" label="Add Tags" />
                    <ActionButton onClick={() => setActiveModal('status')} icon="q-stats" label="Change Status" />
                </div>
                <Tooltip content="Clear Selection">
                    <button onClick={handleClearAllSelection} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-quility-accent-bg border border-quility-border text-quility-dark-grey hover:bg-red-100 hover:border-red-300 hover:text-quility-destructive transition-colors" title="Clear selection">
                        <Icon name="x-close-q" size={18} />
                    </button>
                </Tooltip>
            </div>

            {/* Render Modals based on activeModal state */}
            {activeModal === 'view' && (
                <SelectedLeadsModal
                    selectedLeads={selectedLeads}
                    setSelectedLeads={setSelectedLeads}
                    onClose={() => setActiveModal(null)}
                    onClearAllSelection={handleClearAllSelection}
                />
            )}
            {activeModal === 'dial' && (
                <DialSessionSetupModal
                    selectedLeads={selectedLeadsList}
                    onClose={() => setActiveModal(null)}
                    onStartDialSession={handleStartDialSession}
                />
            )}
            {activeModal === 'workflow' && (
                <BulkAddWorkflowModal leadIds={leadIdsArray} onClose={() => setActiveModal(null)} onSuccess={() => handleSuccess('Leads added to workflow.')} />
            )}
            {activeModal === 'tag' && (
                <BulkAddTagModal leadIds={leadIdsArray} onClose={() => setActiveModal(null)} onSuccess={() => handleSuccess('Tags added to leads.')} />
            )}
            {activeModal === 'status' && (
                <BulkChangeStatusModal leadIds={leadIdsArray} onClose={() => setActiveModal(null)} onSuccess={() => handleSuccess('Lead statuses changed.')} />
            )}
            {activeModal === 'text' && (
                <BulkSendTextModal leadIds={leadIdsArray} onClose={() => setActiveModal(null)} onSuccess={() => handleSuccess('Text message sent to leads.')} />
            )}
            {activeModal === 'ai' && (
                <BulkAiToggleModal leadIds={leadIdsArray} onClose={() => setActiveModal(null)} onSuccess={() => handleSuccess('AI settings updated for leads.')} />
            )}

            <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        </>
    );
};
