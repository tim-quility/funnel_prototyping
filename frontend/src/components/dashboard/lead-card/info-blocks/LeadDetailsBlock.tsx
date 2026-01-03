
import React, { useState } from 'react';
import type { Lead, LeadFieldLayout, ProvisionedNumber } from '../../../../types';
import Icon from '../../../common/Icon';
import EditableValue from '../../../common/EditableValue';
import CustomizeLeadFieldsModal from '../CustomizeLeadFieldsModal';
import { ALL_LEAD_DETAIL_FIELDS, DEFAULT_LEAD_DETAIL_LAYOUTS } from '../../../../constants';
import { usePhone } from '../../../../context/PhoneContext';
import CallInitiationModal from '../../../phone/CallInitiationModal';
import { formatPhoneNumber } from '../../../../utils/formatters';
import { useQuery } from '@tanstack/react-query';
import { fetchProvisionedNumbers } from '../../../../utils/number-api';

interface LeadDetailsBlockProps {
    lead: Lead;
    onUpdateLead: (updates: Partial<Lead>) => void;
}

const LEAD_FIELD_LAYOUT_STORAGE_KEY = 'funnel-lead-detail-field-layouts';

const LeadDetailsBlock: React.FC<LeadDetailsBlockProps> = ({ lead, onUpdateLead }) => {
    const { makeCall, amdStatus} = usePhone();
    const [editingFieldId, setEditingFieldId] = useState<keyof Lead | null>(null);
    const [isCustomizeFieldsModalOpen, setIsCustomizeFieldsModalOpen] = useState(false);
    const [dialingNumber, setDialingNumber] = useState<string | null>(null);

    // Fetch provisioned numbers to determine dial behavior
    const { data: numbers = [] } = useQuery<ProvisionedNumber[], Error>({
        queryKey: ['provisionedNumbers'],
        queryFn: fetchProvisionedNumbers,
    });

    const [fieldLayouts, setFieldLayouts] = useState<LeadFieldLayout>(() => {
        try {
            const saved = localStorage.getItem(LEAD_FIELD_LAYOUT_STORAGE_KEY);
            return saved ? JSON.parse(saved) as LeadFieldLayout : DEFAULT_LEAD_DETAIL_LAYOUTS;
        } catch {
            return DEFAULT_LEAD_DETAIL_LAYOUTS;
        }
    });

    const currentFieldLayout = fieldLayouts[lead.lead_type] || fieldLayouts.default;

    const handleSaveField = (fieldId: keyof Lead, newValue: string | number | boolean) => {
        if ((lead[fieldId] as any) !== newValue) {
            const updates: Partial<Lead> = { [fieldId]: newValue as any };
            if (fieldId === 'borrower_first' || fieldId === 'borrower_last') {
                updates.name = `${updates.borrower_first || lead.borrower_first} ${updates.borrower_last || lead.borrower_last}`.trim();
            }
            onUpdateLead(updates);
        }
        setEditingFieldId(null);
    };

    const handleCancelEdit = () => {
        setEditingFieldId(null);
    };

    const handleSaveFieldLayout = (newLayout: (keyof Lead)[]) => {
        const newLayouts = { ...fieldLayouts, [lead.lead_type]: newLayout };
        setFieldLayouts(newLayouts);
        localStorage.setItem(LEAD_FIELD_LAYOUT_STORAGE_KEY, JSON.stringify(newLayouts));
        setIsCustomizeFieldsModalOpen(false);
    };

    const handleInitiateCall = (number: string | undefined) => {
        if (!number) return;

        if (numbers.length === 1) {
            // Only one number provisioned, dial immediately
            makeCall(number, numbers[0].phoneNumber, lead.lead_id, amdStatus, lead.name);
        } else {
            // Multiple numbers or none (to show error), open modal
            setDialingNumber(number);
        }
    };

    const handleExecuteCall = (fromNumber: string) => {
        if (dialingNumber) {
            makeCall(dialingNumber, fromNumber, lead.lead_id,  amdStatus, lead.name);
            setDialingNumber(null);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-quility-border shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-quility-dark-text">Lead Details</h3>
                <button
                    onClick={() => setIsCustomizeFieldsModalOpen(true)}
                    className="flex items-center gap-2 px-2 py-1 text-xs font-semibold bg-white border border-quility-border text-quility-dark-text rounded-md hover:bg-quility-accent-bg"
                >
                    <Icon name="settings" size={14} />
                    Customize
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {currentFieldLayout.map(fieldId => {
                    const fieldConfig = ALL_LEAD_DETAIL_FIELDS.find(f => f.id === fieldId);
                    if (!fieldConfig) return null;

                    const value = lead[fieldId];
                    const isEditable = fieldConfig.editable;
                    const isPhoneField = fieldConfig.type === 'phone';

                    return (
                        <div key={fieldId} className="flex flex-col">
                            <p className="text-xs text-quility-dark-grey">{fieldConfig.label}</p>
                            <EditableValue
                                value={value as string | number | boolean | null | undefined}
                                onSave={(newValue) => handleSaveField(fieldId, newValue)}
                                onCancel={handleCancelEdit}
                                isEditing={isEditable && editingFieldId === fieldId}
                                onStartEdit={() => isEditable && setEditingFieldId(fieldId)}
                                label={fieldConfig.label}
                                type={fieldConfig.type}
                                options={fieldConfig.options}
                                placeholder={fieldConfig.label}
                                className="mt-1"
                                onDial={isPhoneField ? () => handleInitiateCall(value as string) : undefined}
                            />
                        </div>
                    );
                })}
            </div>

            {isCustomizeFieldsModalOpen && (
                <CustomizeLeadFieldsModal
                    leadType={lead.lead_type}
                    currentLayout={currentFieldLayout}
                    allFields={ALL_LEAD_DETAIL_FIELDS}
                    onSave={handleSaveFieldLayout}
                    onClose={() => setIsCustomizeFieldsModalOpen(false)}
                />
            )}

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

export default LeadDetailsBlock;
