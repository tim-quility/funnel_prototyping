
import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import PrimaryButton from '../common/PrimaryButton';
import OutlineButton from '../common/OutlineButton';
import { useQuery } from '@tanstack/react-query';
import { fetchStatuses } from '../../utils/status-api';
import type { LeadStatus } from '../../types';

interface StatusMapperProps {
    uniqueCsvValues: string[];
    onComplete: (mapping: Record<string, number>) => void;
    onBack: () => void;
}

const StatusMapper: React.FC<StatusMapperProps> = ({ uniqueCsvValues, onComplete, onBack }) => {
    // Map CSV String -> System Status ID
    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    
    const { data: systemStatuses, isLoading } = useQuery<LeadStatus[], Error>({
        queryKey: ['statuses'],
        queryFn: fetchStatuses,
    });

    // Auto-match on load
    useEffect(() => {
        if (systemStatuses && uniqueCsvValues.length > 0) {
            const initialMap: Record<string, string> = {};
            uniqueCsvValues.forEach(csvVal => {
                // Try to find a case-insensitive match
                const match = systemStatuses.find(s => s.name.toLowerCase() === csvVal.toLowerCase());
                if (match) {
                    initialMap[csvVal] = String(match.id);
                } else {
                    // Default to first available status (usually 'New') or empty
                    initialMap[csvVal] = '';
                }
            });
            setStatusMap(initialMap);
        }
    }, [systemStatuses, uniqueCsvValues]);

    const handleChange = (csvVal: string, systemId: string) => {
        setStatusMap(prev => ({ ...prev, [csvVal]: systemId }));
    };

    const handleNext = () => {
        // Convert string IDs back to numbers for the backend
        const finalMap: Record<string, number> = {};
        
        // Validation: Ensure all are mapped
        const unmapped = uniqueCsvValues.filter(val => !statusMap[val]);
        if (unmapped.length > 0) {
            alert(`Please map the following statuses: ${unmapped.join(', ')}`);
            return;
        }

        Object.entries(statusMap).forEach(([key, val]) => {
            finalMap[key] = parseInt(val as string, 10);
        });

        onComplete(finalMap);
    };

    if (isLoading) return <div className="p-8 text-center text-quility-dark-grey">Loading system statuses...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-quility-dark-text">Map Statuses</h2>
            <p className="mt-2 text-sm text-quility-dark-grey">
                We found unique status values in your file. Please map them to your system statuses.
            </p>

            <div className="mt-6 border border-quility-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-quility-accent-bg border-b border-quility-border">
                    <div className="p-3 font-bold text-quility-dark-text border-r border-quility-border">Value in File</div>
                    <div className="p-3 font-bold text-quility-dark-text">Funnel System Status</div>
                </div>
                <div className="max-h-96 overflow-y-auto bg-white">
                    {uniqueCsvValues.map(csvVal => (
                        <div key={csvVal} className="grid grid-cols-2 items-center border-b border-quility-border last:border-b-0">
                            <div className="p-3 text-sm text-quility-dark-text border-r border-quility-border flex items-center gap-2">
                                <Icon name="tag" size={16} className="text-quility-dark-grey" />
                                {csvVal || <em className="text-gray-400">(Empty)</em>}
                            </div>
                            <div className="p-2">
                                <select
                                    value={statusMap[csvVal] || ''}
                                    onChange={(e) => handleChange(csvVal, e.target.value)}
                                    className={`w-full h-10 px-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-quility/50 ${!statusMap[csvVal] ? 'border-red-300 bg-red-50' : 'border-quility-border bg-white'}`}
                                >
                                    <option value="">-- Select Status --</option>
                                    {systemStatuses?.map(status => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <OutlineButton onClick={onBack} label="Back" />
                <PrimaryButton 
                    onClick={handleNext} 
                    label="Next: Preview Data" 
                    rightContent={<Icon name="q-chevron-right" size={18} />}
                />
            </div>
        </div>
    );
};

export default StatusMapper;
