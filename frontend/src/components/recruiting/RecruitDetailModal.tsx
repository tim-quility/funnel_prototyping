import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { Recruit } from '../../types';

interface RecruitDetailModalProps {
    recruit: Recruit;
    onClose: () => void;
    onSave: (updatedRecruit: Recruit) => void;
}

const RecruitDetailModal: React.FC<RecruitDetailModalProps> = ({ recruit, onClose, onSave }) => {
    const [formData, setFormData] = useState<Recruit>(recruit);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleToggle = (name: keyof Recruit) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    const handleNudge = () => {
        alert(`Nudge sent to ${formData.name}! (Mock: "Hi ${formData.name}, just wanted to follow up and see if you had any questions.")`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh]"
            >
                <div className="p-4 border-b border-quility-border flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-quility-dark-text">{recruit.name}</h2>
                        <p className="text-sm text-quility-dark-grey">Recruit Information</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                        <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g., FL" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Source" name="source" value={formData.source} onChange={handleChange} placeholder="e.g., LinkedIn, Referral" />
                    </div>
                     <div className="pt-4 border-t border-quility-border">
                        <Toggle label="Has Insurance License?" checked={formData.hasLicense} onChange={() => handleToggle('hasLicense')} />
                        {formData.hasLicense && (
                            <div className="mt-4">
                                <InputField label="Licensed States" name="licensedStates" value={formData.licensedStates} onChange={handleChange} placeholder="e.g., FL, GA, TX (comma-separated)"/>
                            </div>
                        )}
                    </div>
                     <div className="pt-4 border-t border-quility-border">
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                        />
                    </div>
                </div>
                <div className="p-3 bg-quility-accent-bg rounded-b-lg flex justify-between items-center mt-auto">
                     <button type="button" onClick={handleNudge} className="h-10 px-4 text-sm font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey flex items-center gap-2">
                        <Icon name="zap" size={16} />
                        Nudge
                    </button>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-transparent text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                            Cancel
                        </button>
                        <button type="button" onClick={handleSave} className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = 
({ label, name, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-quility-dark-text mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
        />
    </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <div className="flex items-center">
        <button
            type="button"
            className={`${checked ? 'bg-quility-dark-green' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
            onClick={onChange}
        >
            <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
        <span className="ml-3 text-sm font-medium text-quility-dark-text">{label}</span>
    </div>
);


export default RecruitDetailModal;