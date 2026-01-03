
import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import PrimaryButton from '../common/PrimaryButton';
import OutlineButton from '../common/OutlineButton';
import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../../utils/filter-api';
import type { FilterOptions } from '../../types';

interface TypeMapperProps {
    uniqueCsvValues: string[];
    onComplete: (mapping: Record<string, string> | string) => void;
    onBack: () => void;
}

const TypeMapper: React.FC<TypeMapperProps> = ({ uniqueCsvValues, onComplete, onBack }) => {
    const isMappingMode = uniqueCsvValues.length > 0;
    const [typeMap, setTypeMap] = useState<Record<string, string>>({});
    const [defaultType, setDefaultType] = useState<string>('');
    
    const { data: filterOptions, isLoading } = useQuery<FilterOptions, Error>({
        queryKey: ['filterOptions'],
        queryFn: fetchFilterOptions,
    });

    const systemTypes = [
        { id: 'mp', name: 'Mortgage Protection'},
        {id: 'gl', name: 'General Life'},
        {id: 'fe', name: 'Final Expense'},
    ];

    useEffect(() => {
        if (isMappingMode && systemTypes.length > 0) {
            const initialMap: Record<string, string> = {};
            uniqueCsvValues.forEach(csvVal => {
                const match = systemTypes.find(s => s.name.toLowerCase() === csvVal.toLowerCase());
                initialMap[csvVal] = match ? match.id : '';
            });
            setTypeMap(initialMap);
        }
    }, [systemTypes, uniqueCsvValues, isMappingMode]);

    const handleNext = () => {
        if (isMappingMode) {
            const unmapped = uniqueCsvValues.filter(val => !typeMap[val]);
            if (unmapped.length > 0) {
                alert(`Please map all lead types found in your file.`);
                return;
            }
            onComplete(typeMap);
        } else {
            if (!defaultType) {
                alert(`Please select a lead type for these leads.`);
                return;
            }
            onComplete(defaultType);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-quility-dark-grey">Loading system types...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-quility-dark-text">
                {isMappingMode ? 'Map Lead Types' : 'Assign Lead Type'}
            </h2>
            <p className="mt-2 text-sm text-quility-dark-grey">
                {isMappingMode 
                    ? 'Map the lead types from your CSV to the system lead types.' 
                    : 'Since no "Lead Type" column was mapped, please choose a type for all imported leads.'}
            </p>

            <div className="mt-6 bg-white border border-quility-border rounded-lg overflow-hidden shadow-sm">
                {isMappingMode ? (
                    <>
                        <div className="grid grid-cols-2 bg-quility-accent-bg border-b border-quility-border">
                            <div className="p-3 font-bold text-quility-dark-text border-r border-quility-border text-sm uppercase">CSV Value</div>
                            <div className="p-3 font-bold text-quility-dark-text text-sm uppercase">System Lead Type</div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {uniqueCsvValues.map(csvVal => (
                                <div key={csvVal} className="grid grid-cols-2 items-center border-b border-quility-border last:border-b-0">
                                    <div className="p-3 text-sm text-quility-dark-text border-r border-quility-border font-medium">
                                        {csvVal || <em className="text-gray-400">Empty</em>}
                                    </div>
                                    <div className="p-2">
                                        <select
                                            value={typeMap[csvVal] || ''}
                                            onChange={(e) => setTypeMap(prev => ({ ...prev, [csvVal]: e.target.value }))}
                                            className={`w-full h-10 px-3 text-sm border rounded-md focus:ring-2 focus:ring-quility/50 outline-none ${!typeMap[csvVal] ? 'border-red-200 bg-red-50' : 'border-quility-border bg-white'}`}
                                        >
                                            <option value="">-- Select Type --</option>
                                            {systemTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-8 flex flex-col items-center gap-4">
                        <div className="w-full max-w-sm">
                            <label className="block text-sm font-bold text-quility-dark-grey uppercase mb-2">Select Type</label>
                            <select
                                value={defaultType}
                                onChange={(e) => setDefaultType(e.target.value)}
                                className="w-full h-12 px-4 text-base border-2 border-quility-border rounded-lg focus:border-quility outline-none"
                            >
                                <option value="">-- Select a Lead Type --</option>
                                {systemTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-quility-dark-grey italic text-center">
                            Note: All {uniqueCsvValues.length === 0 ? 'imported' : ''} leads will be assigned this type.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <OutlineButton onClick={onBack} label="Back" />
                <PrimaryButton 
                    onClick={handleNext} 
                    label="Next: Status Mapping" 
                    rightContent={<Icon name="q-chevron-right" size={18} />}
                />
            </div>
        </div>
    );
};

export default TypeMapper;
