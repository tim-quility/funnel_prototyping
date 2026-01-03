import React, { useState } from 'react';
import type { Lead } from '../../../../types';
import Icon from '../../../common/Icon';

interface QualifierTabProps {
    lead: Lead;
}

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; }> = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-quility-dark-text mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text"
        />
    </div>
);

const QualifierTab: React.FC<QualifierTabProps> = ({ lead }) => {
    const [qualifierData, setQualifierData] = useState({
        smoker: 'no',
        annualIncome: '50000',
        healthConditions: '',
        desiredCoverage: '100000',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQualifierData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // In a real app, this would be a mutation to save the data
        alert(`Qualifier data saved for ${lead.name}:\n${JSON.stringify(qualifierData, null, 2)}`);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-quility-border">
                <h2 className="text-xl font-bold text-quility-dark-text mb-4">Qualifier Form</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Smoker Status</label>
                        <select name="smoker" value={qualifierData.smoker} onChange={handleChange} className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text">
                            <option value="no">Non-Smoker</option>
                            <option value="yes">Smoker</option>
                        </select>
                    </div>
                    <InputField label="Annual Household Income" name="annualIncome" value={qualifierData.annualIncome} onChange={handleChange} type="number" />
                    <InputField label="Desired Coverage Amount" name="desiredCoverage" value={qualifierData.desiredCoverage} onChange={handleChange} type="number" />
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Known Health Conditions</label>
                        <textarea
                            name="healthConditions"
                            value={qualifierData.healthConditions}
                            onChange={handleChange}
                            rows={4}
                            placeholder="e.g., High blood pressure, Diabetes"
                            className="w-full p-2 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-text"
                        />
                    </div>
                </div>
                 <div className="mt-6 text-right">
                    <button onClick={handleSave} className="h-10 px-6 font-bold rounded-md bg-quility-button text-white">
                        Save Qualifier Info
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QualifierTab;
