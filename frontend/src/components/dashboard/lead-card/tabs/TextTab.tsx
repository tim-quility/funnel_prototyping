import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Lead, Message, ProvisionedNumber } from '../../../../types';
import Icon from '../../../common/Icon';
import { useConversation } from '../../../../context/ConversationContext';
import MessageInput from '../../../conversations/MessageInput';
import Avatar from '../../../common/Avatar';
import Spinner from '../../../common/Spinner';
import { startConversation } from '../../../../utils/conversation-api';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../context/AuthContext';
import { fetchProvisionedNumbers } from '../../../../utils/number-api';
import { formatPhoneNumber } from '../../../../utils/formatters';

interface TextTabProps {
    lead: Lead;
}

const TextTab: React.FC<TextTabProps> = ({ lead }) => {
    const {
        conversations,
        isLoading: isConversationsLoading,
        setActiveConversationId,
        activeConversationId,
        markAsRead,
        cancelScheduledMessage,
        sendScheduledMessageNow,
        sendMessage
    } = useConversation();

    const { agent } = useAuth();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    // Agent Numbers
    const { data: agentNumbers = [] } = useQuery<ProvisionedNumber[], Error>({
        queryKey: ['provisionedNumbers'],
        queryFn: fetchProvisionedNumbers,
    });
    console.log(lead)
    // Lead Numbers Analysis
    const leadNumbers = useMemo(() => {
        const nums = [
            { label: 'Primary', value: lead.phone },
            { label: 'Cell', value: lead.borrower_cell },
            { label: 'Home', value: lead.borrower_home },
            { label: 'Work', value: lead.borrower_work },
        ].filter(n => n.value);
        return nums;
    }, [lead]);

    // Filter Conversations for this Lead
    const leadConversations = useMemo(() => {
        return conversations
            .filter(c => c.contactId === lead.lead_id && c.type === 'Sales')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [conversations, lead.lead_id]);

    // Active Tab Management
    // ID can be a conversation.id OR 'new'
    const [activeTabId, setActiveTabId] = useState<string>('loading');

    // Initialize active tab
    useEffect(() => {
        if (!isConversationsLoading) {
            // If currently loading or current tab is invalid (deleted convo), switch to first available or 'new'
            if (activeTabId === 'loading' || (activeTabId !== 'new' && !leadConversations.find(c => c.id === activeTabId))) {
                if (leadConversations.length > 0) {
                    setActiveTabId(leadConversations[0].id);
                } else {
                    setActiveTabId('new');
                }
            }
        }
    }, [leadConversations, isConversationsLoading, activeTabId]);

    // Sync Context
    useEffect(() => {
        if (activeTabId !== 'new' && activeTabId !== 'loading') {
            if (activeConversationId !== activeTabId) {
                setActiveConversationId(activeTabId);
                markAsRead(activeTabId);
            }
        } else {
            if (activeConversationId !== null) {
                setActiveConversationId(null);
            }
        }
    }, [activeTabId, activeConversationId, setActiveConversationId, markAsRead]);

    // Scroll to bottom logic
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeTabId, leadConversations]);

    // --- State for "New Conversation" Mode ---
    const [newToNumber, setNewToNumber] = useState<string>(leadNumbers[0]?.value || '');
    const [newFromNumber, setNewFromNumber] = useState<string>('');

    // Init from number
    useEffect(() => {
         if (agentNumbers.length > 0 && !newFromNumber) {
            setNewFromNumber(agentNumbers[0].phoneNumber);
        } else if (!newFromNumber && agent?.phone) {
             setNewFromNumber(agent.phone);
        }
    }, [agentNumbers, agent, newFromNumber]);

    // --- Handlers ---

    const handleSendNew = async (text: string, imageUrl?: string) => {
        if (!newToNumber) {
            alert("Please select a number to text.");
            return;
        }
        if (!newFromNumber) {
            alert("Please select a number to text from.");
            return;
        }
        try {
            const newConvo = await startConversation(lead.lead_id, newFromNumber, newToNumber, text);
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setActiveTabId(newConvo.id);
        } catch (e: any) {
             console.error("Error starting conversation", e);
             alert("Failed to start conversation.");
        }
    };

    const handleSendExisting = async (text: string, imageUrl?: string) => {
        if (activeTabId && activeTabId !== 'new') {
            sendMessage(activeTabId, text, imageUrl);
        }
    };

    // --- Validation Helpers ---

    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getConversationLabel = (convo: typeof conversations[0]) => {
        const num = convo.correspondentNumber;
        const match = leadNumbers.find(ln => ln.value === num);
        if (match) return `${match.label} (${formatPhoneNumber(num || '')})`;
        if (num) return formatPhoneNumber(num);
        return 'Unknown Number';
    };

    const checkConversationValidity = (convo: typeof conversations[0]) => {
        // 1. Check if Lead Number exists
        const toValid = leadNumbers.some(ln => ln.value === convo.correspondentNumber);

        // 2. Check if Agent Number exists
        // NOTE: We assume 'localNumber' might be available on the conversation object or implicit.
        // If the type definition doesn't strictly have it, we try to access it or default to valid if unknown.
        // For strictness: we check if ANY of the agent's current numbers matches the conversation context if known.
        // Since `Conversation` type in frontend might not carry `localNumber` (sender), we rely on backend enforcement usually.
        // However, if we assume we tracked it:
        const convoAny = convo as any;
        const fromNumber = convoAny.localNumber || convoAny.agentNumber;
        const fromValid = fromNumber ? agentNumbers.some(an => an.phoneNumber === fromNumber) : true; // Default true if we can't track it on frontend

        return {
            valid: toValid && fromValid,
            toValid,
            fromValid
        };
    };

    const activeConversation = leadConversations.find(c => c.id === activeTabId);
    const validity = activeConversation ? checkConversationValidity(activeConversation) : { valid: false, toValid: false, fromValid: false };

    if (isConversationsLoading) return <div className="p-10 text-center"><Spinner /></div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 min-h-0 relative">

            {/* 1. Tabs Area */}
            <div className="flex items-center gap-2 p-2 border-b border-quility-border bg-white overflow-x-auto flex-shrink-0 no-scrollbar">
                {leadConversations.map(convo => {
                    const status = checkConversationValidity(convo);
                    return (
                        <button
                            key={convo.id}
                            onClick={() => setActiveTabId(convo.id)}
                            className={`px-3 py-1.5 rounded-md border text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                                activeTabId === convo.id
                                    ? 'bg-quility-light-green border-quility-dark-green text-quility-dark-green'
                                    : 'bg-white border-gray-200 text-quility-dark-grey hover:bg-gray-50'
                            }`}
                        >
                            {getConversationLabel(convo)}
                            {!status.valid && <Icon name="alert-triangle" size={12} className="text-yellow-500" />}
                        </button>
                    )
                })}
                <button
                    onClick={() => setActiveTabId('new')}
                    className={`px-3 py-1.5 rounded-md border text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                        activeTabId === 'new'
                            ? 'bg-quility-button text-white border-quility-button'
                            : 'bg-white border-dashed border-quility-border text-quility-dark-grey hover:border-quility hover:text-quility'
                    }`}
                >
                    <Icon name="plus" size={12} /> New
                </button>
            </div>

            {/* 2. Content Area - Fixed Height for Scrolling */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50 h-[500px]">
                {activeTabId === 'new' ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-quility-light-green rounded-full flex items-center justify-center mx-auto mb-3">
                                <Icon name="message-circle-q" size={32} className="text-quility-dark-green" />
                            </div>
                            <h3 className="text-lg font-bold text-quility-dark-text">Start New Conversation</h3>
                            <p className="text-sm text-quility-dark-grey">Select a recipient number to begin.</p>
                        </div>

                        <div className="w-full max-w-xs space-y-4 p-4 bg-white rounded-lg border border-quility-border shadow-sm">
                             <div>
                                <label className="block text-xs font-bold text-quility-dark-grey uppercase mb-1">To (Lead):</label>
                                <select
                                    value={newToNumber}
                                    onChange={e => setNewToNumber(e.target.value)}
                                    className="w-full h-9 px-2 text-sm border rounded bg-gray-50 border-quility-border focus:border-quility"
                                >
                                    {leadNumbers.length > 0 ? (
                                        leadNumbers.map(num => (
                                            <option key={num.value} value={num.value}>{num.label}: {formatPhoneNumber(num.value || '')}</option>
                                        ))
                                    ) : (
                                        <option value="">No numbers available</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-quility-dark-grey uppercase mb-1">From (Agent):</label>
                                <select
                                    value={newFromNumber}
                                    onChange={e => setNewFromNumber(e.target.value)}
                                    className="w-full h-9 px-2 text-sm border rounded bg-gray-50 border-quility-border focus:border-quility"
                                >
                                    {agentNumbers.length > 0 ? (
                                        agentNumbers.map(n => (
                                            <option key={n.sid} value={n.phoneNumber}>{n.friendlyName} ({formatPhoneNumber(n.phoneNumber)})</option>
                                        ))
                                    ) : (
                                        <option value={agent?.phone}>{agent?.phone || 'Default'}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                ) : activeConversation ? (
                     <>
                        {!validity.valid && (
                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-xs flex flex-col gap-1 mb-4">
                                <div className="flex items-center gap-2 font-bold">
                                    <Icon name="alert-triangle" size={16} />
                                    <span>Conversation Paused</span>
                                </div>
                                {!validity.toValid && <span>• The lead's number ({formatPhoneNumber(activeConversation.correspondentNumber || '')}) is no longer associated with this profile.</span>}
                                {!validity.fromValid && <span>• The agent number used for this thread is no longer active in your account.</span>}
                            </div>
                        )}
                        {activeConversation.messages.map((msg: Message) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-end gap-2 ${msg.sender === 'agent' ? 'flex-row-reverse' : ''}`}>
                                    {msg.sender === 'contact' && <Avatar name={lead.name} avatarUrl={lead.avatarUrl} size={28} />}
                                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-left text-sm shadow-sm ${
                                        msg.sender === 'agent'
                                        ? 'bg-quility-dark-green text-white rounded-br-sm'
                                        : 'bg-white border border-gray-200 text-quility-dark-text rounded-bl-sm'
                                    }`}>
                                        {msg.imageUrl && (
                                            <div className="mb-2 cursor-zoom-in" onClick={() => setZoomedImage(msg.imageUrl!)}>
                                                <img src={msg.imageUrl} alt="attached" className="rounded-lg object-cover max-h-48 max-w-full bg-gray-100" />
                                            </div>
                                        )}
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 px-2 mt-1">
                                    {formatTimestamp(msg.timestamp)}
                                </p>
                            </div>
                        ))}
                         {activeConversation.scheduledMessage && (
                            <div className="px-1">
                                <ScheduledMessageDisplay
                                    scheduledMessage={{
                                        ...activeConversation.scheduledMessage,
                                        sender: 'agent',
                                        id: activeConversation.scheduledMessage.id,
                                        timestamp: activeConversation.scheduledMessage.scheduledAt
                                    }}
                                    onSendNow={() => sendScheduledMessageNow(activeConversation.id)}
                                    onCancel={() => cancelScheduledMessage(activeConversation.id)}
                                    setZoomedImage={setZoomedImage}
                                />
                            </div>
                        )}
                     </>
                ) : (
                    <div className="text-center py-10 text-gray-400">Select a conversation.</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 3. Input Area */}
            {activeTabId === 'new' ? (
                 <div className="flex-shrink-0 bg-white z-10 border-t border-quility-border">
                    <MessageInput onSend={handleSendNew} />
                </div>
            ) : validity.valid ? (
                <div className="flex-shrink-0 bg-white z-10 border-t border-quility-border">
                    <MessageInput onSend={handleSendExisting} />
                </div>
            ) : null}

             {/* Lightbox */}
            {zoomedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setZoomedImage(null)}
                >
                    <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                        <Icon name="x-close-q" size={24} />
                    </button>
                    <img src={zoomedImage} alt="Enlarged" className="max-w-full max-h-full object-contain rounded-md shadow-2xl" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};

// Subcomponent for Scheduled Messages
const ScheduledMessageDisplay: React.FC<{
    scheduledMessage: Message;
    onSendNow: () => void;
    onCancel: () => void;
    setZoomedImage: (url: string) => void;
}> = ({ scheduledMessage, onSendNow, onCancel, setZoomedImage }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setIsOptionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scheduledTime = new Date(scheduledMessage.timestamp).toLocaleString([], {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    return (
        <div className="p-3 my-2 bg-blue-50 border-l-4 border-blue-400 rounded relative">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                        <Icon name="clock-q" size={14} />
                        <span>Scheduled for: {scheduledTime}</span>
                    </div>
                    <div className="text-sm text-gray-700 pl-1">
                        {scheduledMessage.imageUrl && (
                            <div className="mb-1 cursor-pointer inline-block" onClick={() => setZoomedImage(scheduledMessage.imageUrl!)}>
                                <img src={scheduledMessage.imageUrl} alt="preview" className="h-16 w-auto rounded border border-blue-200" />
                            </div>
                        )}
                        <p className="italic">{scheduledMessage.text}</p>
                    </div>
                </div>
                <div className="relative" ref={optionsRef}>
                    <button onClick={() => setIsOptionsOpen(prev => !prev)} className="p-1 text-blue-400 hover:text-blue-700 rounded-full">
                        <Icon name="q-elipses-h" size={20} />
                    </button>
                    {isOptionsOpen && (
                        <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10 overflow-hidden">
                            <button onClick={() => { onSendNow(); setIsOptionsOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Icon name="arrow-up" size={14} /> Send Now
                            </button>
                            <button onClick={() => { onCancel(); setIsOptionsOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Icon name="trash-q" size={14} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextTab;