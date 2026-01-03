
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Icon from '../common/Icon';
import { LEAD_FIELDS_FOR_MAPPING, REQUIRED_IMPORT_FIELDS } from '../../constants';
import type { Mapping, MappingProfile } from '../../types';

interface FieldMapperProps {
  csvHeaders: string[];
  onMappingComplete: (mapping: Mapping) => void;
  onCancel: () => void;
}

const attemptAutoMapping = (csvHeaders: string[]): Mapping => {
    const mapping: Mapping = {};
    const dbFields = LEAD_FIELDS_FOR_MAPPING;
    
    csvHeaders.forEach(header => {
        const lowerHeader = header.toLowerCase().replace(/_/g, ' ').trim();
        const foundMatch = dbFields.find(field => 
            field.value.toLowerCase().replace(/_/g, ' ') === lowerHeader ||
            field.label.toLowerCase() === lowerHeader
        );
        if (foundMatch) {
            mapping[header] = foundMatch.value;
        }
    });
    return mapping;
};

const FieldMapper: React.FC<FieldMapperProps> = ({ csvHeaders, onMappingComplete, onCancel }) => {
    const [mapping, setMapping] = useState<Mapping>(() => attemptAutoMapping(csvHeaders));
    const [profiles, setProfiles] = useState<MappingProfile[]>(() => {
        const saved = localStorage.getItem('funnel-mapping-profiles');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    
    const topRef = useRef<HTMLDivElement>(null);

    const handleMappingChange = (csvHeader: string, dbField: string) => {
        setMapping(prevMapping => {
            const newMapping = { ...prevMapping };

            // If a new dbField is selected (not 'do not import'), unmap it from any other column.
            if (dbField) {
                for (const key in newMapping) {
                    if (newMapping[key] === dbField && key !== csvHeader) {
                        newMapping[key] = ''; // Unmap from the old column
                    }
                }
            }
    
            // Set the new mapping for the current column.
            newMapping[csvHeader] = dbField;
            return newMapping;
        });
        // Clear errors when user makes a change to encourage re-validation
        if (validationErrors.length > 0) setValidationErrors([]);
    };

    const handleApplyProfile = (profileId: string) => {
        const profile = profiles.find(p => p.id === profileId);
        if (profile) {
            setMapping(profile.mapping);
            setValidationErrors([]);
        }
    };
    
    const handleSaveProfile = () => {
        if (newProfileName.trim()) {
            const newProfile: MappingProfile = {
                id: `profile_${Date.now()}`,
                name: newProfileName,
                mapping,
            };
            const updatedProfiles = [...profiles, newProfile];
            setProfiles(updatedProfiles);
            localStorage.setItem('funnel-mapping-profiles', JSON.stringify(updatedProfiles));
            setIsSavingProfile(false);
            setNewProfileName('');
        }
    };

    const handleNext = () => {
        // Validate that all required fields are mapped
        const mappedTargetFields = Object.values(mapping);
        const missingRequiredFields = REQUIRED_IMPORT_FIELDS.filter(
            reqField => !mappedTargetFields.includes(reqField)
        );

        if (missingRequiredFields.length > 0) {
            const missingLabels = missingRequiredFields.map(key => 
                LEAD_FIELDS_FOR_MAPPING.find(f => f.value === key)?.label || key
            );
            
            setValidationErrors(missingLabels);
            
            // Scroll to top so user sees the error banner
            if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        onMappingComplete(mapping);
    };

    const mappedFieldsCount = Object.values(mapping).filter(Boolean).length;
    const groupedDbFields = useMemo(() => {
        return LEAD_FIELDS_FOR_MAPPING.reduce((acc, field) => {
            acc[field.group] = [...(acc[field.group] || []), field];
            return acc;
        }, {} as { [group: string]: typeof LEAD_FIELDS_FOR_MAPPING });
    }, []);
    
    const usedDbFields = useMemo(() => new Set(Object.values(mapping).filter(Boolean)), [mapping]);

    return (
        <div className="max-w-4xl mx-auto" ref={topRef}>
            <h2 className="text-xl font-bold text-quility-dark-text">Map Your CSV Fields</h2>
            <div className="mt-2 text-sm text-quility-dark-grey">
                <p>Match the columns from your file to the corresponding fields in Funnel.</p>
                <p className="mt-1 font-semibold text-quility-dark-green">
                    Required: {REQUIRED_IMPORT_FIELDS.map(f => LEAD_FIELDS_FOR_MAPPING.find(lf => lf.value === f)?.label).join(', ')}.
                </p>
            </div>

            {/* Error Banner */}
            {validationErrors.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md shadow-sm flex items-start gap-3 animate-fade-in-up">
                    <Icon name="alert-triangle" size={24} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-red-800 text-sm">Missing Required Mappings</h4>
                        <p className="text-sm text-red-700 mt-1">Please ensure the following fields are mapped to a column in your CSV:</p>
                        <ul className="list-disc list-inside text-sm text-red-700 mt-1 ml-1 font-semibold">
                            {validationErrors.map(field => <li key={field}>{field}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            <div className="my-6 p-4 bg-quility-accent-bg rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-quility-dark-text mb-1">Load Mapping Profile</label>
                    <select
                        onChange={(e) => handleApplyProfile(e.target.value)}
                        className="w-full md:w-64 h-10 px-3 text-base border rounded-md bg-white border-quility-border text-quility-dark-grey"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a profile...</option>
                        {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                {isSavingProfile ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newProfileName}
                            onChange={e => setNewProfileName(e.target.value)}
                            placeholder="Profile Name"
                            className="h-10 px-3 text-base border rounded-md bg-white border-quility-border text-quility-dark-grey"
                        />
                        <button onClick={handleSaveProfile} className="h-10 px-4 font-bold bg-quility-button text-white rounded-md">Save</button>
                        <button onClick={() => setIsSavingProfile(false)} className="h-10 px-4 font-semibold text-quility-dark-grey rounded-md">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsSavingProfile(true)} className="px-4 py-2 text-sm font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey flex items-center gap-2">
                        <Icon name="plus-circle" size={16} /> Save Current Mapping
                    </button>
                )}
                </div>
            </div>

            <div className={`border rounded-lg overflow-hidden transition-colors ${validationErrors.length > 0 ? 'border-red-300' : 'border-quility-border'}`}>
                <div className="grid grid-cols-2 bg-quility-accent-bg">
                    <div className="p-3 font-bold text-quility-dark-text border-r border-quility-border">Column from your file</div>
                    <div className="p-3 font-bold text-quility-dark-text">Funnel Lead Field</div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {csvHeaders.map(header => (
                        <div key={header} className={`grid grid-cols-2 items-center border-t border-quility-border transition-colors ${mapping[header] ? 'bg-quility-light-green' : ''}`}>
                            <div className="p-3 font-semibold text-quility-dark-text border-r border-quility-border bg-quility-accent-bg">{header}</div>
                            <div className="p-2">
                                <select 
                                    value={mapping[header] || ''}
                                    onChange={(e) => handleMappingChange(header, e.target.value)}
                                    className="w-full h-10 px-2 text-base border-0 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-quility/50 text-quility-dark-grey"
                                >
                                    <option value="">-- Do not import --</option>
                                    {Object.keys(groupedDbFields).map((group) => (
                                        <optgroup label={group} key={group}>
                                            {groupedDbFields[group].map(field => {
                                                const isUsedByAnother = usedDbFields.has(field.value) && mapping[header] !== field.value;
                                                const isRequired = REQUIRED_IMPORT_FIELDS.includes(field.value);
                                                return (
                                                    <option
                                                        key={field.value}
                                                        value={field.value}
                                                        disabled={isUsedByAnother}
                                                        className={isUsedByAnother ? 'text-gray-400' : isRequired ? 'font-bold text-quility-dark-text' : ''}
                                                    >
                                                        {field.label} {isRequired ? '*' : ''}
                                                    </option>
                                                );
                                            })}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="p-3 bg-quility-accent-bg border-t border-quility-border">
                    <p className="text-sm font-semibold text-quility-dark-text">{mappedFieldsCount} of {csvHeaders.length} columns mapped.</p>
                </div>
            </div>

             <div className="mt-8 flex justify-between items-center">
                <button onClick={onCancel} className="px-6 py-2 text-base font-bold bg-transparent border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                    Back
                </button>
                <button 
                    onClick={handleNext}
                    className="px-6 py-2 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover flex items-center gap-2"
                >
                    Next: Preview Data <Icon name="q-chevron-right" size={18} />
                </button>
            </div>
        </div>
    );
};

export default FieldMapper;
