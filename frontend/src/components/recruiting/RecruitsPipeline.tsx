
import React, { useState, useMemo, useEffect } from 'react';
import RecruitCard from './RecruitCard';
import InviteRecruitModal from './InviteRecruitModal';
import Icon from '../common/Icon';
import type { Recruit, RecruitingPipeline, MovePipelineAutomation } from '../../types';
import RecruitDetailModal from './RecruitDetailModal';
import CustomizePipelineModal from './CustomizePipelineModal';
import PrimaryButton from '../common/PrimaryButton'; // New import
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecruit, createRecruit, savePipelines } from '../../utils/recruiting-api';
import { mockResourcePackets, mockTextTemplates } from '../../constants';

interface RecruitsPipelineProps {
    initialRecruits: Recruit[];
    initialPipelines: RecruitingPipeline[];
    defaultRecruitStageId: string | null; // New: Default stage ID from fetched data
}

const RecruitsPipeline: React.FC<RecruitsPipelineProps> = ({ initialRecruits, initialPipelines, defaultRecruitStageId }) => {
    const queryClient = useQueryClient();
    
    // Local state now primarily manages UI state, not the core data
    const [recruits, setRecruits] = useState<Recruit[]>(initialRecruits);
    const [pipelines, setPipelines] = useState<RecruitingPipeline[]>(initialPipelines);
    const [activePipelineId, setActivePipelineId] = useState<string>(pipelines[0]?.id || '');
    const [globalDefaultStageId, setGlobalDefaultStageId] = useState<string | null>(defaultRecruitStageId); // New: Global default stage
    
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [selectedRecruit, setSelectedRecruit] = useState<Recruit | null>(null);
    const [draggedRecruitId, setDraggedRecruitId] = useState<string | null>(null);

    // Effect to synchronize local state with props when initial data changes
    useEffect(() => {
        setRecruits(initialRecruits);
        setPipelines(initialPipelines);
        // Ensure activePipelineId remains valid or defaults to first pipeline
        if (!initialPipelines.some(p => p.id === activePipelineId)) {
            setActivePipelineId(initialPipelines[0]?.id || '');
        }
        setGlobalDefaultStageId(defaultRecruitStageId);
    }, [initialRecruits, initialPipelines, defaultRecruitStageId]);


    const activePipeline = useMemo(() => pipelines.find(p => p.id === activePipelineId) || pipelines[0], [pipelines, activePipelineId]);

    // --- Mutations ---
    const updateRecruitMutation = useMutation({
        mutationFn: updateRecruit,
        onSuccess: (updatedRecruit) => {
             queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
             // Immediately update local state for responsiveness
             setRecruits(prev => prev.map(r => r.id === updatedRecruit.id ? {...r, ...updatedRecruit} : r));
        },
        onError: (error) => {
            console.error("Failed to update recruit:", error);
            // Optionally show a toast notification
        }
    });

    const createRecruitMutation = useMutation({
        mutationFn: createRecruit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
        }
    });

    const savePipelinesMutation = useMutation({
        // FIX: Now accepts defaultRecruitStageId
        mutationFn: ({ updatedPipelines, newDefaultRecruitStageId }: { updatedPipelines: RecruitingPipeline[], newDefaultRecruitStageId: string | null }) => 
            savePipelines(updatedPipelines, newDefaultRecruitStageId),
        onSuccess: (savedPipelines) => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            // The API call returns all data, so we refetch it via invalidate.
            // For a responsive UI, we can optimistically update local state if needed.
            // When `recruitingData` is refetched, pipelines and default stage will update.
            setIsCustomizeModalOpen(false);
        }
    });


    // --- Handlers ---
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, stageId: string) => {
        e.preventDefault();
        if (draggedRecruitId && activePipeline) {
            const recruit = recruits.find(r => r.id === draggedRecruitId);
            const stage = activePipeline.stages.find(s => s.id === stageId);
    
            if (recruit && stage && recruit.stage !== stageId) {
                const moveAutomation = stage.automations.find(
                    (a): a is MovePipelineAutomation => a.action === 'move-pipeline'
                );
    
                if (moveAutomation) {
                    alert(`Automation Triggered: Moving ${recruit.name} to a new pipeline.`);
                    updateRecruitMutation.mutate({ id: draggedRecruitId, stage: moveAutomation.targetStageId });
                } else {
                    updateRecruitMutation.mutate({ id: draggedRecruitId, stage: stageId });
                    
                    stage.automations.forEach(automation => {
                        if (automation.action === 'send-packet') {
                            const packet = mockResourcePackets.find(p => p.id === automation.targetId);
                            if (packet) alert(`Automation Triggered: Sent packet "${packet.name}" to ${recruit.name}.`);
                        } else if (automation.action === 'send-text') {
                            const template = mockTextTemplates.find(t => t.id === automation.targetId);
                             // FIX: Property 'name' does not exist on type 'TextTemplate'. Use 'title' instead.
                             if (template) alert(`Automation Triggered: Sent text "${template.title}" to ${recruit.name}.`);
                        }
                    });
                }
            }
        }
        setDraggedRecruitId(null);
        e.currentTarget.classList.remove('bg-quility-light-green/50');
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-quility-light-green/50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-quility-light-green/50');
    }

    const handleAddRecruit = (newRecruitData: Omit<Recruit, 'id' | 'applyDate' | 'source' | 'state' | 'hasLicense' | 'licensedStates' | 'notes'>) => {
        if (activePipeline && activePipeline.stages.length > 0) {
            // FIX: Use the globalDefaultStageId if set, otherwise fallback to the first stage of the active pipeline.
            const targetStageId = globalDefaultStageId || activePipeline.stages[0].id;
            createRecruitMutation.mutate({ ...newRecruitData, stage: targetStageId });
        } else {
            alert("Cannot add recruit: No pipeline or stages available.");
        }
        setIsInviteModalOpen(false);
    };

    const handleSaveRecruit = (updatedRecruit: Recruit) => {
        updateRecruitMutation.mutate(updatedRecruit);
        setSelectedRecruit(null);
    };

    const handleSavePipelines = (updatedPipelines: RecruitingPipeline[], newDefaultRecruitStageId: string | null) => {
        savePipelinesMutation.mutate({ updatedPipelines, newDefaultRecruitStageId });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4">
                    <select
                        value={activePipelineId}
                        onChange={e => setActivePipelineId(e.target.value)}
                        className="h-10 px-3 text-xl font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-quility/50 rounded-md text-quility-dark-grey disabled:opacity-50"
                        disabled={!activePipeline}
                    >
                        {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => setIsCustomizeModalOpen(true)} className="p-2 text-quility-dark-grey hover:text-quility hover:bg-quility-accent-bg rounded-md">
                        <Icon name="settings" size={20} />
                    </button>
                </div>
                <PrimaryButton
                    onClick={() => setIsInviteModalOpen(true)}
                    leftIcon="plus"
                    label="Add Recruit"
                    disabled={!activePipeline}
                />
            </div>
            {activePipeline ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {activePipeline.stages.map(stage => (
                        <div
                            key={stage.id}
                            onDrop={(e) => handleDrop(e, stage.id)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className="w-72 flex-shrink-0 bg-quility-accent-bg rounded-lg transition-colors"
                        >
                            <h3 className="text-sm font-bold text-quility-dark-text p-3 border-b border-quility-border sticky top-0 bg-quility-accent-bg rounded-t-lg z-10">
                                {stage.title} ({recruits.filter(r => r.stage === stage.id).length})
                            </h3>
                            <div className="p-2 space-y-2 h-full">
                                {recruits
                                    .filter(r => r.stage === stage.id)
                                    .map(recruit => (
                                        <RecruitCard 
                                            key={recruit.id} 
                                            recruit={recruit}
                                            onDragStart={() => setDraggedRecruitId(recruit.id)}
                                            onClick={() => setSelectedRecruit(recruit)}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-quility-accent-bg rounded-lg">
                    <Icon name="q-dataflow-1" size={48} className="mx-auto text-quility-dark-grey/50" />
                    <h3 className="mt-4 text-xl font-bold text-quility-dark-text">No pipelines found.</h3>
                    <p className="mt-1 text-quility-dark-grey">Get started by creating your first recruiting pipeline.</p>
                    <PrimaryButton
                        onClick={() => setIsCustomizeModalOpen(true)}
                        label="Create Pipeline"
                        className="mt-4"
                    />
                </div>
            )}
            {isInviteModalOpen && <InviteRecruitModal onClose={() => setIsInviteModalOpen(false)} onAddRecruit={handleAddRecruit} />}
            {selectedRecruit && <RecruitDetailModal recruit={selectedRecruit} onClose={() => setSelectedRecruit(null)} onSave={handleSaveRecruit} />}
            {isCustomizeModalOpen && <CustomizePipelineModal pipelines={pipelines} defaultRecruitStageId={globalDefaultStageId} onClose={() => setIsCustomizeModalOpen(false)} onSave={handleSavePipelines} />}
        </>
    );
};

// FIX: Added default export
export default RecruitsPipeline;
