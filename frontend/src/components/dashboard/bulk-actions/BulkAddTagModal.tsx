import React, { useState, useMemo } from 'react';
import BulkActionModal from './BulkActionModal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchTags } from '../../../utils/tag-api';
import { bulkUpdateLeads } from '../../../utils/lead-api';
import type { Tag } from '../../../types';
import Icon from '../../common/Icon';
import Spinner from '../../common/Spinner';

interface BulkAddTagModalProps {
    leadIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

const BulkAddTagModal: React.FC<BulkAddTagModalProps> = ({ leadIds, onClose, onSuccess }) => {
    const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const { data: allTags = [], isLoading } = useQuery<Tag[], Error>({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });

    const filteredTags = useMemo(() => {
        return allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allTags, searchTerm]);

    const mutation = useMutation({
        mutationFn: (tagIds: string[]) => bulkUpdateLeads({
            leadIds,
            action: 'add-tag',
            value: tagIds,
        }),
        onSuccess: () => {
            onSuccess();
            onClose();
        },
        onError: (error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleToggleTag = (tagId: string) => {
        setSelectedTagIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tagId)) {
                newSet.delete(tagId);
            } else {
                newSet.add(tagId);
            }
            return newSet;
        });
    };

    const handleConfirm = () => {
        if (selectedTagIds.size > 0) {
            mutation.mutate(Array.from(selectedTagIds));
        }
    };

    return (
        <BulkActionModal
            title={`Add Tags to ${leadIds.length} Leads`}
            onClose={onClose}
            onConfirm={handleConfirm}
            confirmText="Add Tags"
            isConfirmDisabled={selectedTagIds.size === 0}
            isLoading={mutation.isPending}
        >
            <div className="space-y-4">
                <div className="relative">
                    <Icon name="q-search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-quility-dark-grey" />
                    <input
                        type="text"
                        placeholder="Search tags..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 text-sm border rounded-md bg-quility-input-bg border-quility-border"
                    />
                </div>
                {isLoading ? <Spinner /> : (
                    <div className="max-h-64 overflow-y-auto border border-quility-border rounded-md">
                        {filteredTags.map(tag => (
                            <label key={tag.id} className="flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-quility-light-hover">
                                <input
                                    type="checkbox"
                                    checked={selectedTagIds.has(tag.id)}
                                    onChange={() => handleToggleTag(tag.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-quility-button focus:ring-quility-button"
                                />
                                <span className="font-semibold text-quility-dark-text">{tag.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </BulkActionModal>
    );
};

export default BulkAddTagModal;
