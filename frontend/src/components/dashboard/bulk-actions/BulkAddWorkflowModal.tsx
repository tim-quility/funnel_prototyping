import React, { useState, useMemo } from 'react';
import BulkActionModal from './BulkActionModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflows } from '../../../utils/workflow-api';
import { bulkUpdateLeads } from '../../../utils/lead-api';
import type { Workflow } from '../../../types';
import Icon from '../../common/Icon';
import Spinner from '../../common/Spinner';

interface BulkAddWorkflowModalProps {
    leadIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

const BulkAddWorkflowModal: React.FC<BulkAddWorkflowModalProps> = ({ leadIds, onClose, onSuccess }) => {
    console.log(leadIds)
    console.log('!')
    const queryClient = useQueryClient();
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: workflows = [], isLoading } = useQuery<Workflow[], Error>({
        queryKey: ['workflows'],
        queryFn: fetchWorkflows,
    });

    const filteredWorkflows = useMemo(() => {
        return workflows.filter(wf => wf.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [workflows, searchTerm]);

    const mutation = useMutation({
        mutationFn: (workflowId: string) => bulkUpdateLeads({
            leadIds,
            action: 'add-workflow',
            value: workflowId,
        }),
        onSuccess: () => {
            onSuccess();
            onClose();
        },
        onError: (error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleConfirm = () => {
        if (selectedWorkflowId) {
            mutation.mutate(selectedWorkflowId);
        }
    };

    return (
        <BulkActionModal
            title={`Add ${leadIds.length} Leads to Workflow`}
            onClose={onClose}
            onConfirm={handleConfirm}
            confirmText="Add to Workflow"
            isConfirmDisabled={!selectedWorkflowId}
            isLoading={mutation.isPending}
        >
            <div className="space-y-4">
                <div className="relative">
                    <Icon name="q-search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-quility-dark-grey" />
                    <input
                        type="text"
                        placeholder="Search workflows..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 text-sm border rounded-md bg-quility-input-bg border-quility-border"
                    />
                </div>
                {isLoading ? <Spinner /> : (
                    <div className="max-h-64 overflow-y-auto border border-quility-border rounded-md">
                        {filteredWorkflows.map(wf => (
                            <label key={wf.id} className="flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-quility-light-hover">
                                <input
                                    type="radio"
                                    name="workflow-selection"
                                    checked={selectedWorkflowId === wf.id}
                                    onChange={() => setSelectedWorkflowId(wf.id)}
                                    className="h-4 w-4 text-quility-button focus:ring-quility-button"
                                />
                                <div>
                                    <p className="font-semibold text-quility-dark-text">{wf.name}</p>
                                    <p className="text-xs text-quility-dark-grey">{wf.steps.length} steps</p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </BulkActionModal>
    );
};

export default BulkAddWorkflowModal;
