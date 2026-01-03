
import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import type { LeadFieldOption, LeadFieldType } from '../../types';
import { formatPhoneNumber } from '../../utils/formatters'; // Re-use phone formatter

interface EditableValueProps {
    value: string | number | boolean | null | undefined;
    onSave: (newValue: string | number | boolean) => void;
    onCancel: () => void;
    isEditing: boolean;
    onStartEdit: () => void;
    label: string; // For accessibility and context
    type: LeadFieldType;
    options?: LeadFieldOption[]; // For select type
    placeholder?: string;
    className?: string; // For custom styling
    min?: number; // For number type
    max?: number; // For number type
    onDial?: () => void; // New: Optional callback for dialing
}

const EditableValue: React.FC<EditableValueProps> = ({
    value,
    onSave,
    onCancel,
    isEditing,
    onStartEdit,
    label,
    type,
    options,
    placeholder,
    className,
    min,
    max,
    onDial,
}) => {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (inputRef.current instanceof HTMLInputElement && inputRef.current.type === 'text') {
                inputRef.current.select(); // Select text for easy editing
            }
        }
    }, [isEditing]);

    const handleSave = () => {
        if (localValue !== value) {
            onSave(localValue as string | number | boolean);
        } else {
            onCancel(); // No change, just exit editing mode
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type !== 'text') { // Don't save on Enter for multiline (if used later)
            handleSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const handleBooleanToggle = () => {
        setLocalValue(prev => !prev);
    };

    // Format display value
    const displayValue = () => {
        if (value === null || value === undefined || value === '') return 'N/A';

        switch (type) {
            case 'phone':
                return formatPhoneNumber(String(value));
            case 'date':
                try {
                    return new Date(String(value)).toLocaleDateString();
                } catch {
                    return String(value);
                }
            case 'select':
                return options?.find(opt => String(opt.value) === String(value))?.label || String(value);
            case 'boolean':
                return value ? 'Yes' : 'No';
            default:
                return String(value);
        }
    };

    // Render logic for different input types
    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <select
                        ref={inputRef as React.RefObject<HTMLSelectElement>}
                        value={String(localValue || '')}
                        onChange={e => setLocalValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        className={`w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text ${className}`}
                        aria-label={`Edit ${label}`}
                    >
                        <option value="">Select...</option>
                        {options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case 'boolean':
                return (
                    <button
                        type="button"
                        className={`${localValue ? 'bg-quility-dark-green' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                        onClick={handleBooleanToggle}
                        onBlur={handleSave}
                        aria-label={`Toggle ${label}`}
                    >
                        <span className={`${localValue ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                    </button>
                );
            case 'date':
                return (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="date"
                        value={String(localValue || '')}
                        onChange={e => setLocalValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        className={`w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text ${className}`}
                        aria-label={`Edit ${label}`}
                    />
                );
            case 'number':
                return (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="number"
                        value={String(localValue || '')}
                        onChange={e => setLocalValue(parseInt(e.target.value) || 0)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        className={`w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text ${className}`}
                        aria-label={`Edit ${label}`}
                    />
                );
            case 'email':
                return (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="email"
                        value={String(localValue || '')}
                        onChange={e => setLocalValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder}
                        className={`w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text ${className}`}
                        aria-label={`Edit ${label}`}
                    />
                );
            case 'phone':
                return (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="tel"
                        value={String(localValue || '').replace(/\D/g, '')} // Show raw digits for editing
                        onChange={e => setLocalValue(e.target.value.replace(/\D/g, ''))}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder}
                        className={`w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text ${className}`}
                        aria-label={`Edit ${label}`}
                    />
                );
            case 'text':
            default:
                return (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={String(localValue || '')}
                        onChange={e => setLocalValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder}
                        className={`w-full h-8 px-2 text-sm border rounded-md bg-white border-quility-border text-quility-dark-text ${className}`}
                        aria-label={`Edit ${label}`}
                    />
                );
        }
    };

    return (
        <div className={`flex-grow ${isEditing ? '' : 'group relative'}`}>
            {isEditing ? (
                renderInput()
            ) : (
                <div className="flex justify-between items-center h-8">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {/* Dial Button - Now on the left */}
                        {onDial && value && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDial(); }}
                                className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors flex-shrink-0"
                                title={`Call ${label}`}
                            >
                                <Icon name="q-phone-call" size={14} />
                            </button>
                        )}
                        <p className="text-sm font-semibold text-quility-dark-text truncate">{displayValue()}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        {onStartEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onStartEdit(); }}
                                className="p-1.5 text-quility-dark-grey hover:text-quility rounded-full hover:bg-quility-accent-bg opacity-0 group-hover:opacity-100 transition-opacity"
                                title={`Edit ${label}`}
                                aria-label={`Edit ${label}`}
                            >
                                <Icon name="q-pencil" size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableValue;
