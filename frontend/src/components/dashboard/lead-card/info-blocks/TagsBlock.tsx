import React, { useState } from 'react';
import type { Lead, Tag } from '../../../../types';
import Icon from '../../../common/Icon';
import InputTextField from '../../../common/InputTextField';
import PrimaryButton from '../../../common/PrimaryButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTags, createTag, tagLead } from '../../../../utils/tag-api';

interface TagsBlockProps {
    lead: Lead;
    onUpdateLead: (updates: Partial<Lead>) => void;
}

const TagsBlock: React.FC<TagsBlockProps> = ({ lead, onUpdateLead }) => {
    const queryClient = useQueryClient();
    const [showNewTagInput, setShowNewTagInput] = useState(false);
    const [newTagName, setNewTagName] = useState('');

    const { data: allTags, isLoading: tagsLoading } = useQuery<Tag[], Error>({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });

    const createTagMutation = useMutation<Tag, Error, Omit<Tag, 'id' | 'created' | 'lead_count'>>({
        mutationFn: createTag,
        onSuccess: (newlyCreatedTag) => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            // Add the new tag to the current lead
            const updatedTags = [...(lead.tags || []), { id: newlyCreatedTag.id, name: newlyCreatedTag.name }];
            onUpdateLead({ tags: updatedTags });
            setNewTagName('');
            setShowNewTagInput(false);
        },
        onError: (err) => {
            alert(`Error creating tag: ${err.message}`);
        },
    });
const tagLeadMutation = useMutation<
    void,
    Error,
    { leadId: string; tagId: string }
    >({
    mutationFn: ({ leadId, tagId }) => tagLead(leadId, tagId),
    onSuccess: (_, { tagId }) => {
        // Optionally update local state to add the tag
        const tagged = allTags?.find(t => t.id === tagId);
        if (tagged) {
            const updatedTags = [...(lead.tags || []), tagged];
            onUpdateLead({ tags: updatedTags });
        }
    },
    onError: (err) => {
        alert(`Error tagging lead: ${err.message}`);
    },
    });
    const handleAddTag = async () => {
        if (!newTagName.trim() || createTagMutation.isPending) return;
//tagLead
        const trimmedTagName = newTagName.trim();

        const tagExistsGlobally = allTags?.find(
            tag => tag.name.toLowerCase() === trimmedTagName.toLowerCase()
        );
        const tagExistsOnLead = lead.tags?.some(
            tag => tag.name.toLowerCase() === trimmedTagName.toLowerCase()
        );

        if (tagExistsOnLead) {
            alert(`Tag "${trimmedTagName}" is already applied to this lead.`);
            return;
        }

        if (!tagExistsGlobally) {
            // Create globally, then added on success
            //createTagMutation.mutate({ name: trimmedTagName });
            createTagMutation.mutate(
                { name: trimmedTagName },
                {
                    onSuccess: (newTag) => {
                    tagLeadMutation.mutate({ leadId: lead.lead_id, tagId: newTag.id });
                    setNewTagName('');
                    setShowNewTagInput(false);
                    },
                }
            );
        } else {
            // Add existing tag to lead
            tagLeadMutation.mutate({ leadId: lead.lead_id, tagId: tagExistsGlobally.id });
            const updatedTags = [...(lead.tags || []), tagExistsGlobally];
            onUpdateLead({ tags: updatedTags });
            setNewTagName('');
            setShowNewTagInput(false);
        }
    };

    const handleRemoveTag = (tagId: string) => {
        const updatedTags = (lead.tags || []).filter(tag => tag.id !== tagId);
        console.log(updatedTags)
        onUpdateLead({ tags: updatedTags });
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-quility-border shadow-sm">
            <h3 className="font-bold text-quility-dark-text mb-3">Tags</h3>

            <div className="flex flex-wrap gap-2">
                {lead.tags && lead.tags.length > 0 ? (
                    lead.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1"
                        >
                            {tag.name}
                            <button
                                onClick={() => handleRemoveTag(tag.id)}
                                className="ml-1 text-blue-600 hover:text-red-700 p-0.5 rounded-full hover:bg-blue-200"
                                title={`Remove "${tag.name}" from lead`}
                            >
                                <Icon name="x-close-q" size={12} />
                            </button>
                        </span>
                    ))
                ) : (
                    <span className="text-sm text-quility-dark-grey">Lead has no tags.</span>
                )}

                {!showNewTagInput ? (
                    <button
                        onClick={() => setShowNewTagInput(true)}
                        className="px-2 py-1 text-xs font-semibold rounded-full bg-quility-accent-bg text-quility-dark-text hover:bg-quility-border flex items-center gap-1"
                    >
                        <Icon name="plus" size={14} /> Add Tag
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <InputTextField
                            label="New Tag Name"
                            value={newTagName}
                            onChange={e => setNewTagName(e.target.value)}
                            placeholder="e.g., Hot Prospect"
                            className="w-36 h-8 text-sm"
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                        />
                        <PrimaryButton
                            label="Add"
                            onClick={handleAddTag}
                            disabled={!newTagName.trim() || createTagMutation.isPending || tagsLoading}
                            className="h-8 px-3 text-xs"
                        />
                        <button
                            onClick={() => setShowNewTagInput(false)}
                            className="h-8 px-3 text-xs font-semibold text-quility-dark-grey rounded-md hover:bg-quility-border"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {tagsLoading && (
                <p className="text-xs text-quility-dark-grey mt-2">Loading available tags...</p>
            )}
        </div>
    );
};

export default TagsBlock;
