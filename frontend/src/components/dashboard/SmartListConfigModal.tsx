import React, { useState, useRef } from 'react';
import Icon from '../common/Icon';
import type { SmartListRule } from '../../types';
import { mockAppInfo } from '../../constants';
import { GoogleGenAI, Type } from '@google/genai';

interface SmartListConfigModalProps {
    initialRules: SmartListRule[];
    onClose: () => void;
    onSave: (rules: SmartListRule[]) => void;
}

const RuleConfigurator: React.FC<{
    rule: SmartListRule;
    onChange: (id: SmartListRule['id'], newConfig: SmartListRule['config']) => void;
}> = ({ rule, onChange }) => {

    // Define common input styles for a consistent look
    const inputClasses = "bg-white border border-quility-border text-quility-dark-grey focus:ring-2 focus:ring-quility/20 focus:border-quility focus:outline-none";

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(rule.id, { ...rule.config, value: parseInt(e.currentTarget.value, 10) || 0 });
    };

    const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(rule.id, { ...rule.config, operator: e.currentTarget.value as any });
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Explicitly type `option` as HTMLOptionElement to resolve TypeScript error where `option` was being inferred as `unknown`.
        const values = Array.from(e.currentTarget.selectedOptions, (option: HTMLOptionElement) => option.value);
        const numericValues = values.map(v => isNaN(parseInt(v, 10)) ? v : parseInt(v, 10));
        onChange(rule.id, { ...rule.config, values: numericValues });
    };

    const renderConfig = () => {
        switch (rule.id) {
            case 'LAST_CONTACTED_DAYS':
                return (
                    <div className="flex items-center gap-2">
                        <span>more than</span>
                        <input type="number" value={rule.config.value ?? ''} onChange={handleValueChange} className={`w-16 h-8 text-center rounded-md ${inputClasses}`} />
                        <span>days ago</span>
                    </div>
                );
            case 'CONTACT_ATTEMPTS':
                return (
                    <div className="flex items-center gap-2">
                        <span>attempts are</span>
                        <select value={rule.config.operator} onChange={handleOperatorChange} className={`h-8 px-2 rounded-md ${inputClasses}`}>
                            <option value="lt">less than</option>
                            <option value="gt">greater than</option>
                        </select>
                        <input type="number" value={rule.config.value ?? ''} onChange={handleValueChange} className={`w-16 h-8 text-center rounded-md ${inputClasses}`} />
                    </div>
                );
            case 'LEAD_AGE':
                return (
                    <div className="flex items-center gap-2">
                        <span>age is</span>
                        <select value={rule.config.operator} onChange={handleOperatorChange} className={`h-8 px-2 rounded-md ${inputClasses}`}>
                            <option value="eq">exactly</option>
                            <option value="gt">greater than</option>
                            <option value="lt">less than</option>
                        </select>
                        <input type="number" value={rule.config.value ?? ''} onChange={handleValueChange} className={`w-16 h-8 text-center rounded-md ${inputClasses}`} />
                         <span>years old</span>
                    </div>
                );
            case 'STATUS':
                return (
                     <div>
                        <span>is one of:</span>
                        <select multiple value={(rule.config.values ?? []).map(String)} onChange={handleMultiSelectChange} className={`w-full mt-1 rounded-md p-2 h-24 ${inputClasses}`}>
                            {mockAppInfo.statuses.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'LEAD_LEVEL':
                 return (
                     <div>
                        <span>is one of:</span>
                        <select multiple value={(rule.config.values ?? []) as string[]} onChange={handleMultiSelectChange} className={`w-full mt-1 rounded-md p-2 h-24 ${inputClasses}`}>
                            {mockAppInfo.lead_levels.map(l => (
                                <option key={l.id} value={l.name}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                );
            default:
                return null;
        }
    };

    const configContent = renderConfig();
    if (!configContent) return null;

    return <div className="mt-2 text-sm text-quility-dark-grey bg-quility-accent-bg p-3 rounded-md">{configContent}</div>;
};


const SmartListConfigModal: React.FC<SmartListConfigModalProps> = ({ initialRules, onClose, onSave }) => {
    const [rules, setRules] = useState<SmartListRule[]>(() => JSON.parse(JSON.stringify(initialRules))); // Deep copy
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleToggle = (id: SmartListRule['id']) => {
        setRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
        ));
    };

    const handleConfigChange = (id: SmartListRule['id'], newConfig: SmartListRule['config']) => {
        setRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, config: newConfig } : rule
        ));
    };

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newRules = [...rules];
        const [draggedItem] = newRules.splice(draggedIndex, 1);
        newRules.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setRules(newRules);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleAiDecide = async () => {
        setIsAiLoading(true);

        const prompt = `You are an expert sales strategist for an insurance CRM. Your task is to prioritize a list of rules for a 'Smart List' feature, which automatically sorts leads for agents to call. The goal is to maximize the chances of contacting high-potential leads that haven't been overworked.

Here are the available rules and their IDs:
- NEVER_CONTACTED: Prioritizes leads that have never been called.
- LAST_CONTACTED_DAYS: Prioritizes leads not contacted recently.
- CONTACT_ATTEMPTS: Prioritizes leads with fewer call attempts.
- LEAD_LEVEL: Prioritizes leads marked as 'Hot', 'Warm', etc.
- STATUS: Prioritizes leads with specific statuses like 'New'.
- LEAD_AGE: Prioritizes leads based on the prospect's age (e.g., around final expense age).

Based on the goal, return a JSON object with a single key 'prioritizedRules' which is an array of objects. Each object must have an 'id' (the rule ID) and an 'enabled' (boolean) property. The array should be ordered from highest priority to lowest. Enable the rules you think are most important for the stated goal. A good strategy often involves prioritizing new, hot leads that haven't been contacted much.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                prioritizedRules: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            enabled: { type: Type.BOOLEAN }
                        }
                    }
                }
            }
        };

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                },
            });

            const aiResponse = JSON.parse(response.text);
            const aiRules: { id: SmartListRule['id']; enabled: boolean }[] = aiResponse.prioritizedRules;

            // Reorder the existing rules based on the AI's response
            const newOrderedRules = aiRules.map(aiRule => {
                const existingRule = rules.find(r => r.id === aiRule.id);
                if (existingRule) {
                    return { ...existingRule, enabled: aiRule.enabled };
                }
                return null;
            }).filter((r): r is SmartListRule => r !== null);

            // Add any rules the AI might have missed back to the end
            rules.forEach(rule => {
                if (!newOrderedRules.some(r => r.id === rule.id)) {
                    newOrderedRules.push(rule);
                }
            });

            setRules(newOrderedRules);

        } catch (err) {
            console.error("AI prioritization failed:", err);
            alert("Sorry, the AI couldn't decide right now. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-6 border-b border-quility-border">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Configure Smart List</h2>
                    <p className="text-sm text-quility-dark-grey mt-1">Drag and drop to rank your priority rules. Higher rules have a greater impact on lead scores.</p>
                </header>

                <main className="flex-grow p-6 overflow-y-auto">
                    <ul className="space-y-3">
                        {rules.map((rule, index) => (
                            <li
                                key={rule.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    draggedIndex === index ? 'border-quility bg-quility-light-hover' : 'border-quility-border bg-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="cursor-grab text-quility-dark-grey/50 hover:text-quility-dark-grey" title="Drag to reorder">
                                        <Icon name="grip-vertical" size={20} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-quility-dark-text">{rule.label}</p>
                                        <p className="text-xs text-quility-dark-grey">{rule.description}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(rule.id)}
                                        className={`${rule.enabled ? 'bg-quility-dark-green' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                        title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                                    >
                                        <span className={`${rule.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                    </button>
                                </div>
                                {rule.enabled && <RuleConfigurator rule={rule} onChange={handleConfigChange} />}
                            </li>
                        ))}
                    </ul>
                </main>

                <footer className="flex-shrink-0 p-4 bg-quility-accent-bg rounded-b-lg flex justify-between items-center">
                    <button
                        type="button"
                        onClick={handleAiDecide}
                        disabled={isAiLoading}
                        className="h-10 px-4 text-base font-bold text-quility-dark-text bg-white border-2 border-quility-border rounded-md hover:bg-quility-hover-grey flex items-center gap-2 disabled:opacity-50"
                    >
                        {isAiLoading ? (
                           <svg className="animate-spin h-5 w-5 text-quility" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <Icon name="zap" size={18} />
                        )}
                        Let AI Decide
                    </button>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onSave(rules)}
                            className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover"
                        >
                            Save Configuration
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SmartListConfigModal;