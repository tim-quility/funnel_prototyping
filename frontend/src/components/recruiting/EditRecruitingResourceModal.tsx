import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { RecruitingResource } from '../../types';

interface EditRecruitingResourceModalProps {
    resource: RecruitingResource | null;
    isCreating: boolean;
    onClose: () => void;
    onSave: (resource: RecruitingResource) => void;
}

const EditRecruitingResourceModal: React.FC<EditRecruitingResourceModalProps> = ({ resource, isCreating, onClose, onSave }) => {
    const [currentResource, setCurrentResource] = useState<RecruitingResource>(resource || { id: '', type: 'video', title: '', description: '', category: '', contentUrl: '', thumbnailUrl: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentResource(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(currentResource);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSave} className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-quility-border flex-shrink-0">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">
                        {isCreating ? 'Create New Resource' : 'Edit Resource'}
                    </h2>
                </div>
                <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Title</label>
                            <input type="text" name="title" required value={currentResource.title} onChange={handleChange} className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Type</label>
                            <select name="type" required value={currentResource.type} onChange={handleChange} className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text">
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                                <option value="script">Script</option>
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Category</label>
                            <input type="text" name="category" required value={currentResource.category} onChange={handleChange} className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Thumbnail URL</label>
                            <input type="url" name="thumbnailUrl" required value={currentResource.thumbnailUrl} onChange={handleChange} className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Content URL</label>
                        <input type="url" name="contentUrl" required value={currentResource.contentUrl} onChange={handleChange} className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Description</label>
                        <textarea name="description" value={currentResource.description} onChange={handleChange} rows={4} className="w-full p-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text" />
                    </div>
                </div>
                <div className="p-4 bg-quility-accent-bg border-t border-quility-border flex-shrink-0 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                        Cancel
                    </button>
                    <button type="submit" className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover">
                        Save Resource
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRecruitingResourceModal;