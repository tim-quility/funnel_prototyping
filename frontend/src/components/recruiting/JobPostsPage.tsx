import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import JobPostCard from './JobPostCard';
import EditJobPostModal from './EditJobPostModal';
import ConfirmationModal from '../common/ConfirmationModal';
import type { JobPostTemplate } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobPostTemplate, updateJobPostTemplate, deleteJobPostTemplate } from '../../utils/recruiting-api';

interface JobPostsPageProps {
    initialTemplates: JobPostTemplate[];
}

const JobPostsPage: React.FC<JobPostsPageProps> = ({ initialTemplates }) => {
    const queryClient = useQueryClient();
    const [editingTemplate, setEditingTemplate] = useState<JobPostTemplate | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingTemplate, setDeletingTemplate] = useState<JobPostTemplate | null>(null);

    const filteredTemplates = useMemo(() => {
        return initialTemplates.filter(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialTemplates, searchQuery]);

    const saveMutation = useMutation({
        mutationFn: (template: JobPostTemplate) => {
            if (isCreating) {
                const { id, lastUpdated, ...newTemplate } = template;
                return createJobPostTemplate(newTemplate);
            } else {
                return updateJobPostTemplate(template);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            closeModal();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteJobPostTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitingData'] });
            setDeletingTemplate(null);
        }
    });

    const handleSaveTemplate = (templateToSave: JobPostTemplate) => {
        saveMutation.mutate(templateToSave);
    };

    const handleDelete = () => {
        if (deletingTemplate) {
            deleteMutation.mutate(deletingTemplate.id);
        }
    };

    const openCreateModal = () => {
        setIsCreating(true);
        setEditingTemplate({ id: '', title: '', content: '', lastUpdated: '' });
    };

    const openEditModal = (template: JobPostTemplate) => {
        setIsCreating(false);
        setEditingTemplate(template);
    };

    const closeModal = () => {
        setEditingTemplate(null);
        setIsCreating(false);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg border border-quility-border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-quility-dark-text">Job Post Templates</h2>
                        <p className="text-quility-dark-grey mt-1">Create and manage your reusable job descriptions.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 h-10 px-4 text-base border rounded-md bg-quility-input-bg border-quility-border focus:outline-none focus:ring-2 focus:ring-quility/50 text-quility-dark-grey placeholder:text-quility-dark-grey"
                        />
                        <button
                            onClick={openCreateModal}
                            className="w-full md:w-auto px-4 py-2 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover flex items-center justify-center gap-2"
                        >
                            <Icon name="plus" size={16} />
                            Create Template
                        </button>
                    </div>
                </div>

                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map(template => (
                            <JobPostCard
                                key={template.id}
                                template={template}
                                onEdit={() => openEditModal(template)}
                                onDelete={() => setDeletingTemplate(template)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-quility-dark-grey">
                        <p>No job post templates found.</p>
                    </div>
                )}
            </div>

            {editingTemplate && (
                <EditJobPostModal
                    template={editingTemplate}
                    isCreating={isCreating}
                    onSave={handleSaveTemplate}
                    onClose={closeModal}
                />
            )}

            {deletingTemplate && (
                <ConfirmationModal
                    title="Delete Job Post"
                    message={`Are you sure you want to delete the "${deletingTemplate.title}" template? This action cannot be undone.`}
                    confirmText="Delete"
                    onConfirm={handleDelete}
                    onClose={() => setDeletingTemplate(null)}
                />
            )}
        </>
    );
};

export default JobPostsPage;