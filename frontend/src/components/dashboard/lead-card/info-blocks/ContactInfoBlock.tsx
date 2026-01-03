
import React, { useState, useEffect } from 'react';
import type { Lead } from '../../../../types';
import Icon from '../../../common/Icon';
import { formatPhoneNumber } from '../../../../utils/formatters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLead } from '../../../../utils/lead-api';
import { mockAppInfo } from '../../../../constants'; // For dropdown options
import { usePhone } from '../../../../context/PhoneContext';
import CallInitiationModal from '../../../phone/CallInitiationModal';

interface ContactInfoBlockProps {
    lead: Lead;
}

const EditableText: React.FC<{
    value: string;
    onChange: (newValue: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
    type?: string;
    placeholder?: string;
    label: string; // Used for icon title
}> = ({ value, onChange, onSave, onCancel, isEditing, type = 'text', placeholder, label }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        if (!isEditing) {
            setLocalValue(value); // Reset if not editing and parent value changes
        }
    }, [value, isEditing]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return isEditing ? (
        <div className="flex items-center gap-2">
            <input
                type={type}
                value={localValue}
                onChange={e => setLocalValue(e.target.value)}
                onBlur={onSave} // Save on blur
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="flex-grow h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text"
                autoFocus
            />
            <button onClick={onSave} className="p-1.5 text-green-600 hover:text-green-800" title="Save">
                <Icon name="checkmark-q" size={16} />
            </button>
            <button onClick={onCancel} className="p-1.5 text-gray-500 hover:text-gray-800" title="Cancel">
                <Icon name="x-close-q" size={16} />
            </button>
        </div>
    ) : (
        <p className="text-sm font-semibold text-quility-dark-text group-hover:pr-8 transition-all relative">
            {value || 'N/A'}
        </p>
    );
};

const InfoRowWithEdit: React.FC<{
    icon: string;
    label: string;
    value?: string | null;
    isEditing: boolean;
    onToggleEdit: () => void;
    onSaveEdit: (newValue: string) => void;
    onCancelEdit: () => void;
    type?: string;
    placeholder?: string;
    options?: { id: string | number; name: string }[];
    onDial?: () => void;
}> = ({ icon, label, value, isEditing, onToggleEdit, onSaveEdit, onCancelEdit, type, placeholder, options, onDial }) => {
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    const handleSave = () => {
        onSaveEdit(localValue);
    };

    const handleCancel = () => {
        setLocalValue(value || '');
        onCancelEdit();
    };

    const displayValue = options ? options.find(o => String(o.id) === String(value))?.name || 'N/A' : (value || 'N/A');

    return (
        <div className="flex items-center gap-3 group relative h-8">
            <Icon name={icon} size={18} className="text-quility-dark-grey flex-shrink-0" />
            <div className="flex-grow flex items-center justify-between">
                <div className="flex-grow">
                    <p className="text-xs text-quility-dark-grey">{label}</p>
                    {options ? ( // Dropdown for options
                        isEditing ? (
                            <select
                                value={localValue}
                                onChange={e => setLocalValue(e.target.value)}
                                onBlur={handleSave}
                                className="w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text"
                                autoFocus
                            >
                                <option value="">Select...</option>
                                {options.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-sm font-semibold text-quility-dark-text">{displayValue}</p>
                        )
                    ) : ( // Text input for other types
                        <EditableText
                            value={displayValue} // Always display the formatted value
                            onChange={setLocalValue}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            isEditing={isEditing}
                            type={type}
                            placeholder={placeholder}
                            label={label}
                        />
                    )}
                </div>

                {/* Dial Button */}
                {!isEditing && onDial && value && (
                    <button
                        onClick={onDial}
                        className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors mr-8"
                        title={`Call ${label}`}
                    >
                        <Icon name="q-phone-call" size={14} />
                    </button>
                )}
            </div>

            {!isEditing && (
                <button
                    onClick={onToggleEdit}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-quility-dark-grey hover:text-quility rounded-full hover:bg-quility-accent-bg opacity-0 group-hover:opacity-100 transition-opacity"
                    title={`Edit ${label}`}
                >
                    <Icon name="q-pencil" size={16} />
                </button>
            )}
        </div>
    );
};


const ContactInfoBlock: React.FC<ContactInfoBlockProps> = ({ lead }) => {
    const queryClient = useQueryClient();
    const { makeCall } = usePhone();
    const [editingField, setEditingField] = useState<keyof Lead | null>(null);
    const [dialingNumber, setDialingNumber] = useState<String | null>(null);
    console.log(dialingNumber);
    const updateLeadMutation = useMutation({
        mutationFn: updateLead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead', lead.id] }); // Invalidate and refetch lead details
            setEditingField(null);
        },
        onError: (err) => {
            alert(`Failed to update lead: ${err.message}`);
            setEditingField(null);
        },
    });

    const handleSave = (field: keyof Lead, newValue: string) => {
        if (lead[field] !== newValue) {
            const updates: Partial<Lead> = { [field]: newValue as any };
            if (field === 'borrower_first' || field === 'borrower_last') {
                updates.name = `${updates.borrower_first || lead.borrower_first} ${updates.borrower_last || lead.borrower_last}`.trim();
            }
            updateLeadMutation.mutate({ leadId: lead.id, updates });
        } else {
            setEditingField(null); // No change, just exit editing
        }
    };

    const handleCancelEdit = () => {
        setEditingField(null);
    };

    const handleInitiateCall = (number: String | undefined) => {
        if (!number) return;
        setDialingNumber(number);
    };

    const handleExecuteCall = (fromNumber: String) => {
        if (dialingNumber) {
           // makeCall(dialingNumber, fromNumber);
            setDialingNumber(null);
        }
    };

    // Filter options from mockAppInfo
    const statuses = mockAppInfo.statuses.map(s => ({ id: String(s.id), name: s.name })); // Ensure IDs are strings
    const leadTypes = mockAppInfo.lead_types.map(lt => ({ id: lt.id, name: lt.name }));
    const leadLevels = mockAppInfo.lead_levels.map(ll => ({ id: ll.id, name: ll.name }));

    return (
        <div className="bg-white p-4 rounded-lg border border-quility-border shadow-sm">
            <h3 className="font-bold text-quility-dark-text mb-3">Contact Information</h3>
            <div className="space-y-3">
                <InfoRowWithEdit
                    icon="user-03"
                    label="Name"
                    value={lead.name}
                    isEditing={editingField === 'name'}
                    onToggleEdit={() => setEditingField('name')}
                    onSaveEdit={(val) => handleSave('name', val)}
                    onCancelEdit={handleCancelEdit}
                />
                <InfoRowWithEdit
                    icon="q-email"
                    label="Email"
                    value={lead.email}
                    isEditing={editingField === 'email'}
                    onToggleEdit={() => setEditingField('email')}
                    onSaveEdit={(val) => handleSave('email', val)}
                    onCancelEdit={handleCancelEdit}
                    type="email"
                />
                <InfoRowWithEdit
                    icon="q-phone-call"
                    label="Primary Phone"
                    value={lead.phone ? formatPhoneNumber(lead.phone) : null}
                    isEditing={editingField === 'phone'}
                    onToggleEdit={() => setEditingField('phone')}
                    onSaveEdit={(val) => handleSave('phone', val.replace(/\D/g, ''))} // Save raw digits
                    onCancelEdit={handleCancelEdit}
                    type="tel"
                    onDial={() => handleInitiateCall(lead.phone)}
                />
                 <InfoRowWithEdit
                    icon="q-phone-call"
                    label="Home Phone"
                    value={lead.borrower_home ? formatPhoneNumber(lead.borrower_home) : null}
                    isEditing={editingField === 'borrower_home'}
                    onToggleEdit={() => setEditingField('borrower_home')}
                    onSaveEdit={(val) => handleSave('borrower_home', val.replace(/\D/g, ''))}
                    onCancelEdit={handleCancelEdit}
                    type="tel"
                    onDial={() => handleInitiateCall(lead.borrower_home)}
                />
                 <InfoRowWithEdit
                    icon="q-phone-call"
                    label="Cell Phone"
                    value={lead.borrower_cell ? formatPhoneNumber(lead.borrower_cell) : null}
                    isEditing={editingField === 'borrower_cell'}
                    onToggleEdit={() => setEditingField('borrower_cell')}
                    onSaveEdit={(val) => handleSave('borrower_cell', val.replace(/\D/g, ''))}
                    onCancelEdit={handleCancelEdit}
                    type="tel"
                    onDial={() => handleInitiateCall(lead.borrower_cell)}
                />
                 <InfoRowWithEdit
                    icon="q-phone-call"
                    label="Work Phone"
                    value={lead.borrower_work ? formatPhoneNumber(lead.borrower_work) : null}
                    isEditing={editingField === 'borrower_work'}
                    onToggleEdit={() => setEditingField('borrower_work')}
                    onSaveEdit={(val) => handleSave('borrower_work', val.replace(/\D/g, ''))}
                    onCancelEdit={handleCancelEdit}
                    type="tel"
                    onDial={() => handleInitiateCall(lead.borrower_work)}
                />
                <InfoRowWithEdit
                    icon="q-stats"
                    label="Status"
                    value={lead.status}
                    isEditing={editingField === 'status'}
                    onToggleEdit={() => setEditingField('status')}
                    onSaveEdit={(val) => handleSave('status', val)}
                    onCancelEdit={handleCancelEdit}
                    options={statuses}
                />
                <InfoRowWithEdit
                    icon="file-text-q"
                    label="Lead Type"
                    value={lead.lead_type}
                    isEditing={editingField === 'lead_type'}
                    onToggleEdit={() => setEditingField('lead_type')}
                    onSaveEdit={(val) => handleSave('lead_type', val)}
                    onCancelEdit={handleCancelEdit}
                    options={leadTypes}
                />
                <InfoRowWithEdit
                    icon="activity-q"
                    label="Lead Level"
                    value={lead.lead_level}
                    isEditing={editingField === 'lead_level'}
                    onToggleEdit={() => setEditingField('lead_level')}
                    onSaveEdit={(val) => handleSave('lead_level', val)}
                    onCancelEdit={handleCancelEdit}
                    options={leadLevels}
                />
                 {lead.company && <InfoRowWithEdit icon="q-new-business" label="Company" value={lead.company} isEditing={false} onToggleEdit={() => {}} onSaveEdit={() => {}} onCancelEdit={() => {}} />}
                <InfoRowWithEdit icon="q-map-pin" label="State" value={lead.state} isEditing={false} onToggleEdit={() => {}} onSaveEdit={() => {}} onCancelEdit={() => {}} />
            </div>

            {dialingNumber && (
                <CallInitiationModal
                    toNumber={formatPhoneNumber(dialingNumber)}
                    toName={lead.name}
                    onClose={() => setDialingNumber(null)}
                    onCall={handleExecuteCall}
                />
            )}
        </div>
    );
};

export default ContactInfoBlock;
