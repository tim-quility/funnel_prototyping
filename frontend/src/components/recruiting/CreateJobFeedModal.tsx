import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import PrimaryButton from '../common/PrimaryButton';
import OutlineButton from '../common/OutlineButton';
import InputTextField from '../common/InputTextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobFeed, searchCities, getTopCitiesByState } from '../../utils/recruiting-api';
import type { JobPostTemplate, CityNode } from '../../types';

interface CreateJobFeedModalProps {
    onClose: () => void;
    templates: JobPostTemplate[];
}

const CreateJobFeedModal: React.FC<CreateJobFeedModalProps> = ({ onClose, templates }) => {
    const queryClient = useQueryClient();
    
    // Job Details State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Contract'>('Full-time');
    
    // Targeting State
    const [targetCities, setTargetCities] = useState<CityNode[]>([]);
    const [citySearch, setCitySearch] = useState('');
    const [searchResults, setSearchResults] = useState<CityNode[]>([]);
    
    // Smart Add State
    const [smartState, setSmartState] = useState('TX');
    const [smartCount, setSmartCount] = useState('10');
    const [isSmartLoading, setIsSmartLoading] = useState(false);

    // Apply Template Logic
    const handleApplyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setTitle(template.title);
            setDescription(template.content);
        }
    };

    // City Search Logic
    const handleCitySearch = async (val: string) => {
        setCitySearch(val);
        if (val.length > 2) {
            try {
                const results = await searchCities(val);
                setSearchResults(results);
            } catch (e) {
                console.error(e);
            }
        } else {
            setSearchResults([]);
        }
    };

    const addCity = (city: CityNode) => {
        if (targetCities.length >= 100) return alert('Maximum 100 cities allowed.');
        if (targetCities.some(c => c.city === city.city && c.state === city.state)) return; // No dupes
        setTargetCities([...targetCities, city]);
        setCitySearch('');
        setSearchResults([]);
    };

    const removeCity = (index: number) => {
        const newCities = [...targetCities];
        newCities.splice(index, 1);
        setTargetCities(newCities);
    };

    // Smart Add Logic
    const handleSmartAdd = async () => {
        if (!smartState || !smartCount) return;
        setIsSmartLoading(true);
        try {
            const cities = await getTopCitiesByState(smartState, parseInt(smartCount));
            // Filter duplicates and cap at 100 total
            const currentKeys = new Set(targetCities.map(c => `${c.city},${c.state}`));
            const uniqueNew = cities.filter(c => !currentKeys.has(`${c.city},${c.state}`));
            
            const availableSlots = 100 - targetCities.length;
            const toAdd = uniqueNew.slice(0, availableSlots);
            
            setTargetCities([...targetCities, ...toAdd]);
            
            if (uniqueNew.length > availableSlots) {
                alert(`Added ${toAdd.length} cities. Reached limit of 100.`);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to fetch cities.');
        } finally {
            setIsSmartLoading(false);
        }
    };

    const mutation = useMutation({
        mutationFn: createJobFeed,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobFeeds'] });
            onClose();
        },
        onError: (err: Error) => alert(`Error: ${err.message}`)
    });

    const handleSubmit = () => {
        if (!title || !description || targetCities.length === 0) return;
        mutation.mutate({ title, description, salaryRange, jobType, targets: targetCities });
    };

    const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden">
                
                {/* Left: Job Details */}
                <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-quility-border overflow-y-auto bg-gray-50">
                    <h2 className="text-xl font-bold text-quility-dark-text mb-4">Job Details</h2>
                    
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Load Template (Optional)</label>
                            <select onChange={handleApplyTemplate} className="w-full h-10 px-3 border rounded-md bg-white border-quility-border">
                                <option value="">Select a template...</option>
                                {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <InputTextField label="Job Title" value={title} onChange={e => setTitle(e.target.value)} required />
                        <InputTextField label="Salary Range" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} placeholder="e.g. $80k - $120k / year" />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                            <div className="flex gap-4">
                                {(['Full-time', 'Part-time', 'Contract'] as const).map(t => (
                                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={jobType === t} onChange={() => setJobType(t)} className="text-quility focus:ring-quility" />
                                        <span className="text-sm">{t}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                rows={10}
                                className="w-full p-3 border rounded-md bg-white border-quility-border text-sm"
                                placeholder="Job description..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Location Targeting */}
                <div className="w-full md:w-1/2 flex flex-col h-full">
                    <div className="p-6 border-b border-quility-border bg-white flex-shrink-0">
                        <h2 className="text-xl font-bold text-quility-dark-text mb-4">Target Locations</h2>
                        
                        {/* Smart Add */}
                        <div className="bg-quility-accent-bg p-4 rounded-lg border border-quility-border mb-6">
                            <h4 className="text-xs font-bold text-quility-dark-green uppercase mb-2">Smart Bulk Add</h4>
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="text-xs text-gray-500 block mb-1">State</label>
                                    <select value={smartState} onChange={e => setSmartState(e.target.value)} className="w-full h-9 px-2 text-sm border rounded-md bg-white">
                                        {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="w-24">
                                     <label className="text-xs text-gray-500 block mb-1">Top # Cities</label>
                                     <input type="number" value={smartCount} onChange={e => setSmartCount(e.target.value)} className="w-full h-9 px-2 text-sm border rounded-md bg-white" />
                                </div>
                                <PrimaryButton 
                                    onClick={handleSmartAdd} 
                                    label={isSmartLoading ? "..." : "Add"} 
                                    className="h-9 px-4 text-xs" 
                                    disabled={isSmartLoading}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">Adds most populated cities in selected state.</p>
                        </div>

                        {/* Manual Search */}
                        <div className="relative">
                            <InputTextField 
                                label="Search City Manually" 
                                value={citySearch} 
                                onChange={e => handleCitySearch(e.target.value)} 
                                placeholder="Type city name..." 
                                leftIcon="q-search"
                            />
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white border border-quility-border shadow-lg rounded-md z-10 max-h-48 overflow-y-auto">
                                    {searchResults.map((city, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => addCity(city)} 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-quility-light-hover flex justify-between"
                                        >
                                            <span>{city.city}, {city.state}</span>
                                            <span className="text-gray-400 text-xs">Pop: {(city.population / 1000).toFixed(0)}k</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected List */}
                    <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-gray-700">Selected Cities</h3>
                             <span className={`text-xs font-bold ${targetCities.length >= 100 ? 'text-red-500' : 'text-gray-500'}`}>
                                 {targetCities.length} / 100
                             </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {targetCities.map((city, i) => (
                                <div key={i} className="flex items-center gap-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm shadow-sm">
                                    <span>{city.city}, {city.state}</span>
                                    <button onClick={() => removeCity(i)} className="text-gray-400 hover:text-red-500">
                                        <Icon name="x-close-q" size={14} />
                                    </button>
                                </div>
                            ))}
                            {targetCities.length === 0 && <p className="text-sm text-gray-400 italic">No cities selected yet.</p>}
                        </div>
                    </div>

                    <div className="p-4 border-t border-quility-border bg-white flex justify-end gap-3">
                        <OutlineButton label="Cancel" onClick={onClose} />
                        <PrimaryButton 
                            label={mutation.isPending ? "Creating..." : "Create Feed"} 
                            onClick={handleSubmit} 
                            disabled={mutation.isPending || !title || targetCities.length === 0}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateJobFeedModal;