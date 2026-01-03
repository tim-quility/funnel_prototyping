import React, { useState } from 'react';
import Icon from '../../common/Icon';
import DraggableList from '../../common/DraggableList';
import type { LeadFieldConfig, LeadFieldLayout, Lead } from '../../../types'; // FIX: Imported Lead type
import PrimaryButton from '../../common/PrimaryButton';
import OutlineButton from '../../common/OutlineButton';
import { ALL_LEAD_DETAIL_FIELDS } from '../../../constants';

interface CustomizeLeadFieldsModalProps {
    leadType: string;
    currentLayout: (keyof Lead)[];
    allFields: LeadFieldConfig[];
    onSave: (newLayout: (keyof Lead)[]) => void;
    onClose: () => void;
}

const CustomizeLeadFieldsModal: React.FC<CustomizeLeadFieldsModalProps> = ({ leadType, currentLayout, allFields, onSave, onClose }) => {
    const [activeFields, setActiveFields] = useState<(keyof Lead)[]>(currentLayout);
    const [inactiveFields, setInactiveFields] = useState<(keyof Lead)[]>(() =>
        allFields.filter(field => !currentLayout.includes(field.id)).map(field => field.id)
    );

    const handleAddRemoveField = (fieldId: keyof Lead, isActive: boolean) => {
        if (isActive) {
            // Remove from active, add to inactive
            setActiveFields(prev => prev.filter(id => id !== fieldId));
            setInactiveFields(prev => [...prev, fieldId]);
        } else {
            // Remove from inactive, add to active
            setInactiveFields(prev => prev.filter(id => id !== fieldId));
            setActiveFields(prev => [...prev, fieldId]);
        }
    };

    const getFieldDetails = (fieldId: keyof Lead) => {
        return ALL_LEAD_DETAIL_FIELDS.find(field => field.id === fieldId) || { id: fieldId, label: String(fieldId), type: 'text', group: 'Primary Contact', editable: false };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-quility-border flex-shrink-0">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Customize "{leadType}" Fields</h2>
                    <p className="text-sm text-quility-dark-grey mt-1">Drag and drop to arrange fields, or click to add/remove.</p>
                </div>
                <div className="flex-grow p-6 overflow-y-auto grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-quility-dark-text mb-3">Active Fields (Drag to Reorder)</h3>
                        <div className="min-h-[150px] border-2 border-dashed border-quility-border rounded-lg p-2 bg-quility-accent-bg">
                            {activeFields.length === 0 && (
                                <p className="text-center text-quility-dark-grey text-sm py-4">No fields active. Click on "Available Fields" to add some.</p>
                            )}
                            <DraggableList<(keyof Lead)>
                                items={activeFields}
                                onReorder={setActiveFields}
                                renderItem={(fieldId, index, isDragging) => {
                                    const field = getFieldDetails(fieldId);
                                    return (
                                        <div className={`flex items-center gap-2 p-2 bg-white rounded-md border border-quility-border shadow-sm my-1 ${isDragging ? 'opacity-50' : ''}`}>
                                            <Icon name="grip-vertical" size={16} className="text-quility-dark-grey cursor-grab" />
                                            <span className="flex-grow text-sm font-medium text-quility-dark-text">{field.label}</span>
                                            <button onClick={() => handleAddRemoveField(fieldId, true)} className="p-1.5 text-quility-destructive hover:text-red-700" title="Remove Field">
                                                <Icon name="math-minus-q" size={16} />
                                            </button>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-quility-dark-text mb-3">Available Fields</h3>
                        <div className="min-h-[150px] border-2 border-dashed border-quility-border rounded-lg p-2 bg-quility-accent-bg">
                            {inactiveFields.length === 0 && (
                                <p className="text-center text-quility-dark-grey text-sm py-4">All fields are active!</p>
                            )}
                            {inactiveFields.map(fieldId => {
                                const field = getFieldDetails(fieldId);
                                return (
                                    <button
                                        key={fieldId} // FIX: Use fieldId as key to resolve TypeScript error.
                                        onClick={() => handleAddRemoveField(fieldId, false)}
                                        className="w-full text-left flex items-center gap-2 p-2 bg-white rounded-md border border-quility-border shadow-sm my-1 hover:bg-quility-light-hover"
                                    >
                                        <Icon name="plus" size={16} className="text-quility" />
                                        <span className="text-sm font-medium text-quility-dark-text">{field.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3 mt-auto">
                    <OutlineButton label="Cancel" onClick={onClose} />
                    <PrimaryButton label="Save Layout" onClick={() => onSave(activeFields)} />
                </div>
            </div>
        </div>
    );
};

export default CustomizeLeadFieldsModal;