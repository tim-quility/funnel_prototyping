import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import { mockResourcePackets } from '../../constants'; // Keep mockResourcePackets for now
// FIX: Import 'TextTemplate' type.
import type { PipelineStage, PipelineAutomation, RecruitingPipeline, MovePipelineAutomation, SendPacketAutomation, SendTextAutomation, TextTemplate } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchTextTemplates } from '../../utils/template-api'; // Import the API function

interface AutomationConfigModalProps {
    stage: PipelineStage;
    pipelines: RecruitingPipeline[];
    onClose: () => void;
    onSave: (stageId: string, automations: PipelineAutomation[]) => void;
}

const AutomationConfigModal: React.FC<AutomationConfigModalProps> = ({ stage, pipelines, onClose, onSave }) => {
    const [automations, setAutomations] = useState<PipelineAutomation[]>(stage.automations);
    const [newAction, setNewAction] = useState<'send-packet' | 'send-text' | 'move-pipeline'>('send-packet');
    const [newTargetId, setNewTargetId] = useState('');
    const [newTargetPipelineId, setNewTargetPipelineId] = useState('');
    const [newTargetStageId, setNewTargetStageId] = useState('');

    // Fetch text templates using react-query
    const { data: allTextTemplates = [], isLoading: textTemplatesLoading } = useQuery<TextTemplate[], Error>({
        queryKey: ['textTemplates'],
        queryFn: fetchTextTemplates,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const recruitingTextTemplates = allTextTemplates.filter(t => t.category === 'Recruiting');

    const hasMoveAutomation = automations.some(a => a.action === 'move-pipeline');
    const otherAutomationsExist = automations.length > 0 && !hasMoveAutomation;

    const handleAddAutomation = () => {
        let newAutomation: PipelineAutomation | null = null;
        if (newAction === 'move-pipeline') {
            if (!newTargetPipelineId || !newTargetStageId) return;
            newAutomation = {
                id: `auto_${Date.now()}`,
                action: 'move-pipeline',
                targetPipelineId: newTargetPipelineId,
                targetStageId: newTargetStageId,
            };
            setAutomations([newAutomation]); // Move is exclusive, replaces all others
        } else {
            if (!newTargetId) return;
            if (newAction === 'send-packet') {
                newAutomation = { id: `auto_${Date.now()}`, action: 'send-packet', targetId: newTargetId };
            } else { // send-text
                newAutomation = { id: `auto_${Date.now()}`, action: 'send-text', targetId: newTargetId };
            }
            setAutomations(prev => [...prev, newAutomation!]);
        }

        // Reset inputs
        setNewTargetId('');
        setNewTargetPipelineId('');
        setNewTargetStageId('');
    };
    
    const handleDeleteAutomation = (id: string) => {
        setAutomations(prev => prev.filter(a => a.id !== id));
    };

    const getTargetName = (automation: PipelineAutomation): string => {
        if (automation.action === 'send-packet') {
            return mockResourcePackets.find(p => p.id === automation.targetId)?.name || 'Unknown Packet';
        } else if (automation.action === 'send-text') {
            return recruitingTextTemplates.find(t => t.id === automation.targetId)?.title || 'Unknown Template';
        } else if (automation.action === 'move-pipeline') {
            const targetPipeline = pipelines.find(p => p.id === automation.targetPipelineId);
            const targetStage = targetPipeline?.stages.find(s => s.id === automation.targetStageId);
            return `Move to: ${targetPipeline?.name || '?'} -> ${targetStage?.title || '?'}`;
        }
        return 'Unknown Action';
    };

    const targetOptions = newAction === 'send-packet' ? mockResourcePackets : recruitingTextTemplates;

    const targetPipelineStages = useMemo(() => {
        if (newAction !== 'move-pipeline' || !newTargetPipelineId) return [];
        return pipelines.find(p => p.id === newTargetPipelineId)?.stages || [];
    }, [newAction, newTargetPipelineId, pipelines]);

    if (textTemplatesLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative p-6 text-center">
                    <p className="text-quility-dark-grey">Loading templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-quility-border">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Automations for "{stage.title}"</h2>
                    <p className="text-sm text-quility-dark-grey mt-1">These actions will trigger when a recruit enters this stage.</p>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <h3 className="font-semibold text-quility-dark-text mb-2">Current Triggers</h3>
                        <div className="space-y-2">
                            {automations.length > 0 ? automations.map(auto => (
                                <div key={auto.id} className="flex items-center justify-between p-2 bg-quility-accent-bg rounded-md">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Icon name={auto.action === 'send-packet' ? 'package' : auto.action === 'send-text' ? 'message-square' : 'q-dataflow-1'} size={16} />
                                        <span>{auto.action === 'send-packet' ? 'Send Packet:' : auto.action === 'send-text' ? 'Send Text:' : ''}</span>
                                        <span className="font-semibold">{getTargetName(auto)}</span>
                                    </div>
                                    <button onClick={() => handleDeleteAutomation(auto.id)} className="p-1 text-quility-dark-grey hover:text-quility-destructive">
                                        <Icon name="trash-q" size={18} />
                                    </button>
                                </div>
                            )) : <p className="text-sm text-quility-dark-grey italic">No automations configured for this stage.</p>}
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-quility-border">
                         <h3 className="font-semibold text-quility-dark-text mb-2">Add New Trigger</h3>
                         <div className="space-y-2">
                             <div>
                                <label className="block text-xs font-medium text-quility-dark-text mb-1">Action</label>
                                <select value={newAction} onChange={e => { setNewAction(e.target.value as any); setNewTargetId(''); setNewTargetPipelineId(''); setNewTargetStageId(''); }} className="w-full h-10 px-2 border rounded-md bg-white border-quility-border text-quility-dark-grey">
                                    <option value="send-packet" disabled={hasMoveAutomation}>Send Packet</option>
                                    <option value="send-text" disabled={hasMoveAutomation}>Send Text</option>
                                    <option value="move-pipeline" disabled={otherAutomationsExist}>Move to another pipeline</option>
                                </select>
                                {otherAutomationsExist && <p className="text-xs text-quility-dark-grey mt-1">Remove existing automations to enable the "Move" action.</p>}
                            </div>

                            {newAction !== 'move-pipeline' ? (
                                <div>
                                    <label className="block text-xs font-medium text-quility-dark-text mb-1">
                                        {newAction === 'send-packet' ? 'Packet' : 'Text Template'}
                                    </label>
                                    <select value={newTargetId} onChange={e => setNewTargetId(e.target.value)} className="w-full h-10 px-2 border rounded-md bg-white border-quility-border text-quility-dark-grey" required>
                                        <option value="" disabled>Select...</option>
                                        {targetOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                     <div>
                                        <label className="block text-xs font-medium text-quility-dark-text mb-1">Target Pipeline</label>
                                        <select value={newTargetPipelineId} onChange={e => { setNewTargetPipelineId(e.target.value); setNewTargetStageId(''); }} className="w-full h-10 px-2 border rounded-md bg-white border-quility-border text-quility-dark-grey">
                                            <option value="" disabled>Select Pipeline...</option>
                                            {pipelines.filter(p => p.id !== stage.id.split('_')[0]).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-quility-dark-text mb-1">Target Stage</label>
                                        <select value={newTargetStageId} onChange={e => setNewTargetStageId(e.target.value)} disabled={!newTargetPipelineId} className="w-full h-10 px-2 border rounded-md bg-white border-quility-border text-quility-dark-grey">
                                            <option value="" disabled>Select Stage...</option>
                                            {targetPipelineStages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button onClick={handleAddAutomation} disabled={hasMoveAutomation && automations.length > 0} className="w-full h-10 px-4 bg-quility-button text-white rounded-md mt-2 disabled:opacity-50">
                                Add
                            </button>
                         </div>
                    </div>

                </div>

                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3 mt-auto">
                    <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                        Cancel
                    </button>
                    <button type="button" onClick={() => onSave(stage.id, automations)} className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover">
                        Save Automations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutomationConfigModal;