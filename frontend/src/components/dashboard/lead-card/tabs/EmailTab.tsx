

import React, { useState } from 'react';
import type { Lead, EmailTemplate } from '../../../../types';
import Icon from '../../../common/Icon';
import { useQuery } from '@tanstack/react-query';
import { fetchEmailTemplates } from '../../../../utils/template-api'; // Assuming you have email template API
import Spinner from '../../../common/Spinner';

interface EmailTabProps {
    lead: Lead;
}

// Mock Email Item for display purposes
interface MockEmail {
    id: string;
    subject: string;
    body: string;
    date: string;
    sender: 'agent' | 'lead';
    attachments?: { filename: string; url: string }[];
}

const mockEmailHistory: MockEmail[] = [
    {
        id: 'e1', subject: 'Following up on your inquiry', body: 'Hi [Lead.FirstName], just following up...', date: '2024-07-25T10:00:00Z', sender: 'agent',
    },
    {
        id: 'e2', subject: 'Re: Following up on your inquiry', body: 'Thanks for reaching out! I had a quick question...', date: '2024-07-25T14:30:00Z', sender: 'lead',
    },
    {
        id: 'e3', subject: 'Your requested info', body: 'Here is the info about our plans. Let me know if you have questions.', date: '2024-07-26T09:00:00Z', sender: 'agent',
        attachments: [{ filename: 'Plan_Details.pdf', url: '/files/plan_details.pdf' }]
    },
];


const EmailTab: React.FC<EmailTabProps> = ({ lead }) => {
    const [composing, setComposing] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [history, setHistory] = useState<MockEmail[]>(mockEmailHistory); // Using mock history for now

    const { data: templates, isLoading: templatesLoading } = useQuery<EmailTemplate[], Error>({
        queryKey: ['emailTemplates'],
        queryFn: fetchEmailTemplates,
    });

    const handleSelectTemplate = (template: EmailTemplate) => {
        setSelectedTemplate(template);
        setEmailSubject(template.subject.replace(/\[FirstName\]/g, lead.name.split(' ')[0] || ''));
        setEmailBody(template.content.replace(/\[FirstName\]/g, lead.name.split(' ')[0] || ''));
        // Handle attachments if template has them
    };

    const handleSendEmail = () => {
        if (!emailSubject.trim() || !emailBody.trim()) {
            alert('Subject and body cannot be empty.');
            return;
        }

        const newEmail: MockEmail = {
            id: `e${Date.now()}`,
            subject: emailSubject,
            body: emailBody,
            date: new Date().toISOString(),
            sender: 'agent',
            attachments: attachedFiles.map(file => ({ filename: file.name, url: URL.createObjectURL(file) })),
        };

        setHistory(prev => [...prev, newEmail]);
        alert(`Email sent to ${lead.email || lead.name}!`); // Mock action
        setComposing(false);
        setSelectedTemplate(null);
        setEmailSubject('');
        setEmailBody('');
        setAttachedFiles([]);
    };

    const handleCancelCompose = () => {
        setComposing(false);
        setSelectedTemplate(null);
        setEmailSubject('');
        setEmailBody('');
        setAttachedFiles([]);
    };

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white p-4 rounded-lg border border-quility-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-quility-dark-text">Email Communications</h2>
                    {!composing && (
                        <button
                            onClick={() => setComposing(true)}
                            className="px-3 py-1.5 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover flex items-center gap-2"
                        >
                            <Icon name="plus" size={16} /> Compose Email
                        </button>
                    )}
                </div>

                {composing ? (
                    <div className="space-y-4">
                        <h3 className="font-bold text-quility-dark-text">Compose New Email to {lead.name}</h3>
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Select Template</label>
                            <select
                                value={selectedTemplate?.id || ''}
                                onChange={e => handleSelectTemplate(templates?.find(t => t.id === e.target.value) || null!)}
                                className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                                disabled={templatesLoading}
                            >
                                <option value="">{templatesLoading ? (<Spinner />) : 'No Template'}</option>
                                {templates?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Subject</label>
                            <input
                                type="text"
                                value={emailSubject}
                                onChange={e => setEmailSubject(e.target.value)}
                                className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Body</label>
                            <textarea
                                value={emailBody}
                                onChange={e => setEmailBody(e.target.value)}
                                rows={8}
                                className="w-full p-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-quility-dark-text mb-1">Attachments</label>
                            <input type="file" multiple onChange={handleFileAttach} className="block w-full text-sm text-quility-dark-grey file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-quility-accent-bg file:text-quility-dark-text hover:file:bg-quility-border"/>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {attachedFiles.map((file, index) => (
                                    <span key={index} className="px-2 py-1 bg-quility-light-green text-quility-dark-green text-xs rounded-full flex items-center gap-1">
                                        {file.name}
                                        <button onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))} className="ml-1 text-quility-dark-green hover:text-red-600">
                                            <Icon name="x-close-q" size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={handleCancelCompose} className="px-4 py-2 text-sm font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">Cancel</button>
                            <button onClick={handleSendEmail} className="px-4 py-2 text-sm font-bold bg-quility-button text-quility-light-text rounded-md hover:bg-quility-button-hover">Send Email</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.length > 0 ? (
                            history.map(email => (
                                <div key={email.id} className={`p-3 rounded-md ${email.sender === 'agent' ? 'bg-quility-accent-bg' : 'bg-gray-100'}`}>
                                    <div className="flex justify-between items-center text-xs text-quility-dark-grey mb-1">
                                        <span className="font-semibold">{email.sender === 'agent' ? 'You' : lead.name}</span>
                                        <span>{new Date(email.date).toLocaleString()}</span>
                                    </div>
                                    <h3 className="font-semibold text-quility-dark-text">{email.subject}</h3>
                                    <p className="text-sm text-quility-dark-grey mt-1 line-clamp-2">{email.body}</p>
                                    {email.attachments && email.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                            {email.attachments.map(att => (
                                                <a key={att.url} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white border border-quility-border rounded-full text-quility-dark-grey hover:bg-quility-hover-grey">
                                                    <Icon name="attachment" size={12} /> {att.filename}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-quility-dark-grey">
                                <p>No email history for this lead.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailTab;