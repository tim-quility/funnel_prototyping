

import React, { useState } from 'react';
import Icon from '../common/Icon';
import AutomationConfigModal from './AutomationConfigModal';
import ConfirmationModal from '../common/ConfirmationModal';
import PrimaryButton from '../common/PrimaryButton'; // New import
import OutlineButton from '../common/OutlineButton'; // New import
import InputTextField from '../common/InputTextField'; // New import
import type { RecruitingPipeline, PipelineStage, PipelineAutomation } from '../../types';

interface CustomizePipelineModalProps {
    pipelines: RecruitingPipeline[];
    defaultRecruitStageId: string | null; // New: Global default stage ID
    onClose: () => void;
    onSave: (pipelines: RecruitingPipeline[], defaultRecruitStageId: string | null) => void; // New: onSave now takes defaultRecruitStageId
}

const CustomizePipelineModal: React.FC<CustomizePipelineModalProps> = ({ pipelines, defaultRecruitStageId, onClose, onSave }) => {
    const [localPipelines, setLocalPipelines] = useState<RecruitingPipeline[]>(JSON.parse(JSON.stringify(pipelines)));
    const [selectedPipelineId, setSelectedPipelineId] = useState<string>(pipelines[0]?.id || '');
    const [configuringAutomationsForStage, setConfiguringAutomationsForStage] = useState<PipelineStage | null>(null);
    const [pipelineToDelete, setPipelineToDelete] = useState<RecruitingPipeline | null>(null);
    const [globalDefaultStageId, setGlobalDefaultStageId] = useState<string | null>(defaultRecruitStageId); // New: State for global default stage

    const selectedPipeline = localPipelines.find(p => p.id === selectedPipelineId);

    const handlePipelineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setLocalPipelines(prev => prev.map(p => 
            p.id === selectedPipelineId ? { ...p, name: newName } : p
        ));
    };

    const handleAddPipeline = () => {
        const newPipeline: RecruitingPipeline = {
            id: `pipe_${Date.now()}`,
            name: 'New Pipeline',
            stages: [
                { id: `stage_${Date.now()}`, title: 'New Stage', automations: [] } // No is_default here
            ],
        };
        setLocalPipelines(prev => [...prev, newPipeline]);
        setSelectedPipelineId(newPipeline.id);
    };

    const confirmDeletePipeline = () => {
        if (!pipelineToDelete) return;

        const remainingPipelines = localPipelines.filter(p => p.id !== pipelineToDelete.id);
        setLocalPipelines(remainingPipelines);
        
        if (selectedPipelineId === pipelineToDelete.id) {
            setSelectedPipelineId(remainingPipelines[0]?.id || '');
        }
        // If the deleted pipeline contained the global default stage, clear the global default.
        if (selectedPipeline?.stages.some(s => s.id === globalDefaultStageId)) {
            setGlobalDefaultStageId(null);
        }
        setPipelineToDelete(null);
    };


    const handleStageChange = (stageId: string, newTitle: string) => {
        setLocalPipelines(prev => prev.map(p => {
            if (p.id === selectedPipelineId) {
                return { ...p, stages: p.stages.map(s => s.id === stageId ? { ...s, title: newTitle } : s) };
            }
            return p;
        }));
    };
    
    const handleAddStage = () => {
        const newStage: PipelineStage = { id: `stage_${Date.now()}`, title: 'New Stage', automations: [] };
        setLocalPipelines(prev => prev.map(p => {
            if (p.id === selectedPipelineId) {
                return { ...p, stages: [...p.stages, newStage] };
            }
            return p;
        }));
    };

    const handleDeleteStage = (stageId: string) => {
        setLocalPipelines(prev => prev.map(p => {
            if (p.id === selectedPipelineId) {
                // Prevent deleting the last stage
                if (p.stages.length <= 1) {
                    alert("A pipeline must have at least one stage.");
                    return p;
                }
                const updatedStages = p.stages.filter(s => s.id !== stageId);
                // If the deleted stage was the global default, clear the global default.
                if (stageId === globalDefaultStageId) {
                    setGlobalDefaultStageId(null);
                }
                return { ...p, stages: updatedStages };
            }
            return p;
        }));
    };
    
    const handleSaveAutomations = (stageId: string, automations: PipelineAutomation[]) => {
        setLocalPipelines(prev => prev.map(p => {
            if (p.id === selectedPipelineId) {
                return { ...p, stages: p.stages.map(s => s.id === stageId ? { ...s, automations } : s) };
            }
            return p;
        }));
        setConfiguringAutomationsForStage(null);
    };

    const handleSave = () => {
        onSave(localPipelines, globalDefaultStageId); // Pass globalDefaultStageId to onSave
    };

    return (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh]">
                 <div className="p-6 border-b border-quility-border">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Customize Pipelines</h2>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedPipelineId}
                            onChange={e => setSelectedPipelineId(e.target.value)}
                            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                        >
                            {localPipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                          <button onClick={handleAddPipeline} className="h-10 px-4 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover flex items-center gap-2 flex-shrink-0">
                            <Icon name="plus" size={16} />
                            Create Pipeline
                        </button>
                    </div>
                    
                    {selectedPipeline && (
                        <div>
                             <div className="flex items-center gap-2 mt-4 p-2 bg-quility-accent-bg rounded-md">
                                <label className="text-sm font-semibold text-quility-dark-grey">Name:</label>
                                {/* FIX: Added 'label' prop to InputTextField */}
                                <InputTextField
                                    label="Pipeline Name"
                                    value={selectedPipeline.name}
                                    onChange={handlePipelineNameChange}
                                    className="flex-grow h-8 px-2"
                                />
                                <button
                                    onClick={() => setPipelineToDelete(selectedPipeline)}
                                    disabled={localPipelines.length <= 1}
                                    className="p-1 text-quility-dark-grey hover:text-quility-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete Pipeline"
                                >
                                    <Icon name="trash-q" size={18} />
                                </button>
                            </div>

                            <h3 className="font-bold text-quility-dark-text mt-4 mb-2">Stages for "{selectedPipeline.name}"</h3>
                            <div className="space-y-2">
                                {selectedPipeline.stages.map((stage) => (
                                    <div key={stage.id} className="flex items-center gap-2 p-2 bg-quility-accent-bg rounded-md">
                                        <Icon name="grip-vertical" size={20} className="text-quility-dark-grey cursor-move" />
                                        {/* FIX: Added 'label' prop to InputTextField */}
                                        <InputTextField
                                            label="Stage Title"
                                            value={stage.title}
                                            onChange={(e) => handleStageChange(stage.id, e.target.value)}
                                            className="flex-grow h-8 px-2"
                                        />
                                        <label className="flex items-center text-sm gap-1 ml-auto" title="Set as default entry stage for all new recruits">
                                            <input
                                                type="radio"
                                                name="global-default-stage" // Use a single name for all radio buttons
                                                checked={globalDefaultStageId === stage.id}
                                                onChange={() => setGlobalDefaultStageId(stage.id)}
                                                className="h-4 w-4 rounded-full border-gray-300 text-quility focus:ring-quility"
                                            />
                                            <span className="text-quility-dark-grey">Default</span>
                                        </label>
                                        <button onClick={() => setConfiguringAutomationsForStage(stage)} className="p-1 text-quility-dark-grey hover:text-quility" title="Configure Automations">
                                            <Icon name="zap" size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteStage(stage.id)} disabled={selectedPipeline.stages.length <= 1} className="p-1 text-quility-dark-grey hover:text-quility-destructive disabled:opacity-50 disabled:cursor-not-allowed" title="Delete Stage">
                                            <Icon name="trash-q" size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddStage} className="mt-4 text-sm font-semibold text-quility hover:underline flex items-center gap-1">
                                <Icon name="plus" size={16} /> Add Stage
                            </button>
                        </div>
                    )}
                </div>

                 <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3 mt-auto">
                    <OutlineButton label="Cancel" onClick={onClose} />
                    <PrimaryButton label="Save Changes" onClick={handleSave} />
                </div>
            </div>
        </div>
        {configuringAutomationsForStage && (
            <AutomationConfigModal
                stage={configuringAutomationsForStage}
                pipelines={localPipelines}
                onClose={() => setConfiguringAutomationsForStage(null)}
                onSave={handleSaveAutomations}
            />
        )}
        {pipelineToDelete && (
            <ConfirmationModal
                title="Delete Pipeline"
                message={`Are you sure you want to delete the "${pipelineToDelete.name}" pipeline? This will un-assign all recruits in this pipeline and cannot be undone.`}
                confirmText="Delete"
                onConfirm={confirmDeletePipeline}
                onClose={() => setPipelineToDelete(null)}
            />
        )}
        </>
    );
};

export default CustomizePipelineModal;