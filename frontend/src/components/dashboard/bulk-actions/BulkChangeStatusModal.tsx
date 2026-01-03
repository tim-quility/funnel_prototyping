import React, { useState, useMemo } from 'react';
import BulkActionModal from './BulkActionModal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchFilterOptions } from '../../../utils/filter-api';
import { bulkUpdateLeads } from '../../../utils/lead-api';
import type { FilterOptions } from '../../../types';
import Icon from '../../common/Icon';
import Spinner from '../../common/Spinner';

interface BulkChangeStatusModalProps {
    leadIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

const BulkChangeStatusModal: React.FC<BulkChangeStatusModalProps> = ({ leadIds, onClose, onSuccess }) => {
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: filterOptions, isLoading } = useQuery<FilterOptions, Error>({
        queryKey: ['filterOptions'],
        queryFn: fetchFilterOptions,
    });

    const statuses = filterOptions?.statuses || [];

    const filteredStatuses = useMemo(() => {
        return statuses.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [statuses, searchTerm]);

    const mutation = useMutation({
        mutationFn: (statusId: number) => bulkUpdateLeads({
            leadIds,
            action: 'change-status',
            value: String(statusId),
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
        if (selectedStatusId !== null) {
            mutation.mutate(selectedStatusId);
        }
    };

    return (
        <BulkActionModal
            title={`Change Status for ${leadIds.length} Leads`}
            onClose={onClose}
            onConfirm={handleConfirm}
            confirmText="Change Status"
            isConfirmDisabled={selectedStatusId === null}
            isLoading={mutation.isPending}
        >
            <div className="space-y-4">
                <div className="relative">
                    <Icon name="q-search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-quility-dark-grey" />
                    <input
                        type="text"
                        placeholder="Search statuses..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 text-sm border rounded-md bg-quility-input-bg border-quility-border"
                    />
                </div>
                {isLoading ? <Spinner /> : (
                    <div className="max-h-64 overflow-y-auto border border-quility-border rounded-md">
                        {filteredStatuses.map(status => (
                            <label key={status.id} className="flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-quility-light-hover">
                                <input
                                    type="radio"
                                    name="status-selection"
                                    checked={selectedStatusId === status.id}
                                    onChange={() => setSelectedStatusId(status.id)}
                                    className="h-4 w-4 text-quility-button focus:ring-quility-button"
                                />
                                <span className="font-semibold text-quility-dark-text">{status.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </BulkActionModal>
    );
};

export default BulkChangeStatusModal;
