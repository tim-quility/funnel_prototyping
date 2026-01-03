import React, { useState, useMemo } from 'react';
import BulkActionModal from './BulkActionModal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchTextTemplates } from '../../../utils/template-api';
import { bulkSendText } from '../../../utils/lead-api';
import type { TextTemplate } from '../../../types';
import Icon from '../../common/Icon';
import Spinner from '../../common/Spinner';

interface BulkSendTextModalProps {
    leadIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

type Tab = 'template' | 'compose';

const BulkSendTextModal: React.FC<BulkSendTextModalProps> = ({ leadIds, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState<Tab>('template');

    // Template state
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [templateSearchTerm, setTemplateSearchTerm] = useState('');

    // Compose state
    const [customText, setCustomText] = useState('');
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const [newTemplateTitle, setNewTemplateTitle] = useState('');

    const { data: templates = [], isLoading } = useQuery<TextTemplate[], Error>({
        queryKey: ['textTemplates'],
        queryFn: fetchTextTemplates,
    });

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => t.title.toLowerCase().includes(templateSearchTerm.toLowerCase()));
    }, [templates, templateSearchTerm]);

    const mutation = useMutation({
        mutationFn: () => {
            if (activeTab === 'template') {
                return bulkSendText({ leadIds, templateId: selectedTemplateId });
            } else { // compose
                return bulkSendText({
                    leadIds,
                    customText,
                    saveAsTemplate: saveAsTemplate && newTemplateTitle.trim() ? { title: newTemplateTitle, category: 'Bulk Actions' } : undefined,
                });
            }
        },
        onSuccess: () => {
            onSuccess();
            onClose();
        },
        onError: (error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleConfirm = () => {
        mutation.mutate();
    };

    const isConfirmDisabled = (activeTab === 'template' && !selectedTemplateId) || (activeTab === 'compose' && !customText.trim());

    return (
        <BulkActionModal
            title={`Send Text to ${leadIds.length} Leads`}
            onClose={onClose}
            onConfirm={handleConfirm}
            confirmText="Send Text Message"
            isConfirmDisabled={isConfirmDisabled}
            isLoading={mutation.isPending}
        >
            <div className="space-y-4">
                <div className="border-b border-quility-border">
                    <nav className="-mb-px flex space-x-4">
                        <button onClick={() => setActiveTab('template')} className={`px-3 py-2 text-sm font-semibold border-b-2 ${activeTab === 'template' ? 'border-quility text-quility' : 'border-transparent text-gray-500'}`}>Use Template</button>
                        <button onClick={() => setActiveTab('compose')} className={`px-3 py-2 text-sm font-semibold border-b-2 ${activeTab === 'compose' ? 'border-quility text-quility' : 'border-transparent text-gray-500'}`}>Compose New</button>
                    </nav>
                </div>

                {activeTab === 'template' && (
                    <div className="space-y-3">
                        <div className="relative">
                            <Icon name="q-search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-quility-dark-grey" />
                            <input type="text" placeholder="Search templates..." value={templateSearchTerm} onChange={e => setTemplateSearchTerm(e.target.value)} className="w-full h-10 pl-9 pr-3 text-sm border rounded-md bg-quility-input-bg border-quility-border" />
                        </div>
                        {isLoading ? <Spinner /> : (
                            <div className="max-h-64 overflow-y-auto border border-quility-border rounded-md">
                                {filteredTemplates.map(t => (
                                    <label key={t.id} className="flex items-start gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-quility-light-hover">
                                        <input type="radio" name="template-selection" checked={selectedTemplateId === t.id} onChange={() => setSelectedTemplateId(t.id)} className="h-4 w-4 mt-1 text-quility-button focus:ring-quility-button" />
                                        <div>
                                            <p className="font-semibold text-quility-dark-text">{t.title}</p>
                                            <p className="text-xs text-quility-dark-grey">{t.content}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'compose' && (
                    <div className="space-y-3">
                        <textarea value={customText} onChange={e => setCustomText(e.target.value)} rows={5} placeholder="Type your message here..." className="w-full p-2 text-sm border rounded-md bg-quility-input-bg border-quility-border" />
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={saveAsTemplate} onChange={e => setSaveAsTemplate(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-quility-button" />
                            <span className="text-sm">Save as new template</span>
                        </label>
                        {saveAsTemplate && (
                            <input type="text" value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)} placeholder="New template title" className="w-full h-10 px-3 text-sm border rounded-md bg-quility-input-bg border-quility-border" />
                        )}
                    </div>
                )}
            </div>
        </BulkActionModal>
    );
};

export default BulkSendTextModal;
