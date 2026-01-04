import React, { useState, useRef } from 'react';
import Icon from '../common/Icon';
import type { JobPostTemplate } from '../../types';

interface EditJobPostModalProps {
    template: JobPostTemplate;
    isCreating: boolean;
    onClose: () => void;
    onSave: (template: JobPostTemplate) => void;
}

const variables = [
    'Agent Name', 'Agent Phone', 'Agent Email', 'Agency Website'
];

const EditJobPostModal: React.FC<EditJobPostModalProps> = ({ template, isCreating, onClose, onSave }) => {
    const [currentTemplate, setCurrentTemplate] = useState<JobPostTemplate>(template);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleInsertVariable = (variable: string) => {
        const textarea = contentRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, start) + `[${variable}]` + text.substring(end);
            
            setCurrentTemplate(prev => ({ ...prev, content: newText }));
            
            setTimeout(() => {
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + variable.length + 2;
            }, 0);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(currentTemplate);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSave} className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-quility-border">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">
                        {isCreating ? 'Create Job Post Template' : 'Edit Job Post Template'}
                    </h2>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Template Title</label>
                        <input
                            type="text"
                            required
                            value={currentTemplate.title}
                            onChange={e => setCurrentTemplate(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Content</label>
                        <textarea
                            ref={contentRef}
                            required
                            value={currentTemplate.content}
                            onChange={e => setCurrentTemplate(prev => ({ ...prev, content: e.target.value }))}
                            rows={10}
                            className="w-full p-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey font-mono"
                        />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-quility-dark-text mb-2">Insert Variables</h4>
                        <div className="flex flex-wrap gap-2">
                            {variables.map(variable => (
                                <button
                                    type="button"
                                    key={variable}
                                    onClick={() => handleInsertVariable(variable)}
                                    className="px-2 py-1 text-xs font-semibold bg-quility-accent-bg text-quility-dark-text rounded hover:bg-quility-border"
                                >
                                    {variable}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3 mt-auto">
                    <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-transparent border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                        Cancel
                    </button>
                    <button type="submit" className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover">
                        Save Templateasdf
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditJobPostModal;