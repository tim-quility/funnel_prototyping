
import React, { useState, useMemo, useEffect } from 'react';
import type { Lead, LeadStatus, StatusCategory } from '../../../types';
import Icon from '../../common/Icon';
import Avatar from '../../common/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStatuses } from '../../../utils/status-api';
import { fetchStatusCategories } from '../../../utils/status-category-api';
import { logLeadStatusChange, updateLead } from '../../../utils/lead-api'; // Import updateLead
import FastAppointmentScheduler from '../../appointments/FastAppointmentScheduler';

interface LeadDetailHeaderProps {
    lead: Lead;
    onBack: () => void;
    onScheduleCall: () => void;
}

const LeadDetailHeader: React.FC<LeadDetailHeaderProps> = ({ lead, onBack, onScheduleCall }) => {
    const queryClient = useQueryClient();
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [activeCategoryTab, setActiveCategoryTab] = useState<string | null>(null);
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

    const { data: statuses = [] } = useQuery<LeadStatus[], Error>({
        queryKey: ['statuses'],
        queryFn: fetchStatuses,
    });

    const { data: categories = [] } = useQuery<StatusCategory[], Error>({
        queryKey: ['statusCategories'],
        queryFn: fetchStatusCategories,
    });

    const currentStatus = useMemo(() => {
        if (lead.status) {
            return statuses.find(s => s.id === lead.status);
        }
        return statuses.find(s => s.name === lead.status);
    }, [statuses, lead.status, lead.status]);

    useEffect(() => {
        if (isStatusOpen && categories.length > 0) {
            if (currentStatus) {
                setActiveCategoryTab(currentStatus.categoryId);
            } else if (!activeCategoryTab) {
                setActiveCategoryTab(categories[0].id);
            }
        }
    }, [isStatusOpen, categories, currentStatus]);

    const statusChangeMutation = useMutation({
        mutationFn: (status: LeadStatus) => logLeadStatusChange({
            lead_id: lead.id,
            status_id: status.id,
            status_name: status.name,
            date: Math.floor(Date.now() / 1000),
            appointment: status.underlyingStatus === 'appointment',
            contact: ['contact', 'appointment', 'application'].includes(status.underlyingStatus),
            application: status.underlyingStatus === 'application'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            setIsStatusOpen(false);
        },
        onError: (err: Error) => alert(`Error updating status: ${err.message}`)
    });

    // New mutation for toggling AI
    const updateAiMutation = useMutation({
        mutationFn: (enabled: boolean) => updateLead({ leadId: lead.id, updates: { ai_text_enabled: enabled } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead', lead.id] });
        },
        onError: (err: Error) => alert(`Error updating AI status: ${err.message}`)
    });

    const handleStatusSelect = (status: LeadStatus) => {
        statusChangeMutation.mutate(status);
    };

    const handleAiToggle = () => {
        updateAiMutation.mutate(!lead.ai_text_enabled);
    };

    const displayStatus = currentStatus?.name || lead.status;

    const filteredStatuses = useMemo(() => {
        if (!activeCategoryTab) return [];
        return statuses.filter(s => s.categoryId === activeCategoryTab);
    }, [statuses, activeCategoryTab]);

    const levelColors: { [key: string]: string } = {
        'Hot': 'bg-red-100 text-red-700 border-red-200',
        'Warm': 'bg-orange-100 text-orange-700 border-orange-200',
        'Cold': 'bg-blue-100 text-blue-700 border-blue-200'
    };

    const handleCall = () => alert(`Calling ${lead.name}...`);
    const handleText = () => alert(`Opening text conversation with ${lead.name}...`);
    const handleEmail = () => alert(`Composing email to ${lead.name}...`);

    const handleAppointmentSuccess = () => {
        setIsSchedulerOpen(false);
        alert("Appointment Scheduled!");
    };

    return (
        <>
            <header className="bg-white border-b border-quility-border px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm z-20 relative">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0"
                        title="Back to List"
                    >
                        <Icon name="q-chevron-left" size={24} />
                    </button>

                    <Avatar name={lead.name} avatarUrl={lead.avatarUrl} size={56} className="ring-2 ring-offset-2 ring-gray-100" />

                    <div className="min-w-0">
                        <h1 className="text-2xl font-extrabold text-gray-900 truncate">{lead.name}</h1>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${levelColors[lead.lead_level] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                {lead.lead_level}
                            </span>
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                {lead.lead_type}
                            </span>
                            {lead.state && (
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                                    <Icon name="q-map-pin" size={10} /> {lead.state}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    {/* AI Toggle Switch */}
                    <button
                        onClick={handleAiToggle}
                        disabled={updateAiMutation.isPending}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
                            lead.ai_text_enabled
                                ? 'bg-purple-100 border-purple-300 text-purple-800'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                        title={lead.ai_text_enabled ? "AI Assistant is active" : "AI Assistant is paused"}
                    >
                        <Icon name="brain" size={16} className={lead.ai_text_enabled ? "text-purple-600" : "text-gray-400"} />
                        {lead.ai_text_enabled ? "AI On" : "AI Off"}
                    </button>

                    <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

                    <div className="relative">
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="h-10 px-4 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-quility hover:text-quility transition-all flex items-center gap-2 min-w-[140px] justify-between"
                        >
                            <span>{displayStatus}</span>
                            <Icon name="chevron-down" size={16} className={`transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isStatusOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)}></div>
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden animate-scale-in origin-top-right">
                                    <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 no-scrollbar">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => setActiveCategoryTab(category.id)}
                                                className={`flex-1 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                                                    activeCategoryTab === category.id
                                                        ? 'bg-white text-quility border-quility'
                                                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto py-2">
                                        {filteredStatuses.length > 0 ? (
                                            filteredStatuses.map(status => (
                                                <button
                                                    key={status.id}
                                                    onClick={() => handleStatusSelect(status)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex justify-between items-center
                                                        ${(currentStatus?.id === status.id || lead.status === status.name) ? 'font-bold text-quility bg-quility-light-hover' : 'text-gray-700'}
                                                    `}
                                                >
                                                    <span>{status.name}</span>
                                                    {(currentStatus?.id === status.id || lead.status === status.name) && <Icon name="checkmark-q" size={16} />}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-400 italic text-center">No statuses in this category.</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

                    <button onClick={handleCall} className="h-10 px-4 bg-quility-button text-white font-bold text-sm rounded-lg hover:bg-quility-button-hover shadow-sm hover:shadow transition-all flex items-center gap-2">
                        <Icon name="q-phone-call" size={18} />
                        <span className="hidden sm:inline">Call</span>
                    </button>

                    <button onClick={handleText} className="h-10 w-10 md:w-auto md:px-4 bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                        <Icon name="message-circle-q" size={18} />
                        <span className="hidden md:inline">Text</span>
                    </button>

                     <button onClick={() => setIsSchedulerOpen(true)} className="h-10 w-10 md:w-auto md:px-4 bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all flex items-center justify-center gap-2">
                        <Icon name="calendar-q" size={18} />
                        <span className="hidden md:inline">Schedule</span>
                    </button>

                    <button onClick={handleEmail} className="h-10 w-10 flex items-center justify-center bg-white border-2 border-gray-200 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-800 transition-all">
                        <Icon name="q-email" size={18} />
                    </button>
                </div>
            </header>

            {isSchedulerOpen && (
                <FastAppointmentScheduler
                    leadId={lead.id}
                    leadName={lead.name}
                    onClose={() => setIsSchedulerOpen(false)}
                    onSchedule={handleAppointmentSuccess}
                />
            )}
        </>
    );
};

export default LeadDetailHeader;
