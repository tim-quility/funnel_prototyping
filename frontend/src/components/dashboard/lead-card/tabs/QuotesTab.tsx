

import React, { useState, useMemo } from 'react';
import type { Lead, LeadQualifierData, Quote } from '../../../../types';
import Icon from '../../../common/Icon';
import { GoogleGenAI, Type } from '@google/genai';
import { mockLeadQualifierData, mockQuotes } from '../../../../constants'; // Import mock data
import Spinner from '../../../common/Spinner';
import PrimaryButton from '../../../common/PrimaryButton';

interface QuotesTabProps {
    lead: Lead;
}

const QuotesTab: React.FC<QuotesTabProps> = ({ lead }) => {
    const [quotes, setQuotes] = useState<Quote[]>(mockQuotes[lead.lead_id] || []); // Use mock data for initial quotes
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Retrieve qualifier data from the lead prop, or use mock if not present
    const qualifierData: LeadQualifierData | undefined = lead.qualifierData || mockLeadQualifierData[lead.lead_id];

    const handleGenerateQuotes = async () => {
        if (!qualifierData) {
            setError("Please fill out the Qualifier tab first to generate quotes.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setQuotes([]);

        const prompt = `
            Act as an insurance quoting engine. Based on the following client profile, provide 3 sample quotes for a ${lead.lead_type || 'Final Expense'} policy.

            Client Profile (for ${lead.name}):
            - Age: ${qualifierData.age ?? 55}
            - Smoker: ${qualifierData.smoker}
            - Health Conditions: ${qualifierData.healthConditions || 'None'}
            - Desired Coverage: $${qualifierData.desiredCoverage.toLocaleString()}

            Return the quotes as a JSON object with a single key "quotes", which is an array of objects.
            Each quote object should have these exact keys: "id" (unique string), "company", "coverage", "monthly_premium", and "notes".
        `;

        const schema = {
            type: Type.OBJECT,
            properties: {
                quotes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING }, // Add id to schema
                            company: { type: Type.STRING },
                            coverage: { type: Type.STRING },
                            monthly_premium: { type: Type.STRING },
                            notes: { type: Type.STRING },
                        },
                    },
                },
            },
        };

        try {
            // In a real app, API_KEY should be loaded from process.env.API_KEY
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
            setQuotes(aiResponse.quotes);

        } catch (err) {
            console.error("AI quote generation failed:", err);
            setError("Sorry, there was an issue generating quotes. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="p-4">
            <div className="bg-white p-4 rounded-lg border border-quility-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-quility-dark-text">AI-Powered Quote Estimates</h2>
                    <PrimaryButton
                        onClick={handleGenerateQuotes}
                        disabled={isLoading || !qualifierData} // Disable if no qualifier data
                        label={isLoading ? 'Generating...' : 'Generate Quotes'}
                        leftIcon={isLoading ? undefined : 'zap'}
                    />
                </div>

                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

                {!qualifierData && (
                    <div className="text-center py-10 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50">
                        <Icon name="alert-triangle" size={40} className="mx-auto text-yellow-600" />
                        <h3 className="mt-4 font-bold text-yellow-800">Qualifier Data Needed</h3>
                        <p className="text-sm text-yellow-700">Please fill out the "Qualifier" tab with client information before generating quotes.</p>
                    </div>
                )}

                {qualifierData && quotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {quotes.map((quote, index) => (
                            <div key={quote.id} className="p-4 border border-quility-border rounded-lg bg-quility-accent-bg">
                                <h3 className="font-bold text-lg text-quility-dark-green">{quote.company}</h3>
                                <p className="text-2xl font-bold mt-2">{quote.monthly_premium}<span className="text-sm font-normal text-quility-dark-grey">/mo</span></p>
                                <p className="text-sm font-semibold mt-1">for {quote.coverage} coverage</p>
                                <p className="text-xs text-quility-dark-grey mt-3 pt-3 border-t border-dashed">{quote.notes}</p>
                            </div>
                        ))}
                    </div>
                ) : qualifierData && !isLoading && (
                     <div className="text-center py-10 border-2 border-dashed border-quility-border rounded-lg">
                        <Icon name="receipt" size={40} className="mx-auto text-quility-dark-grey/50" />
                        <h3 className="mt-4 font-bold text-quility-dark-text">Generate Sample Quotes</h3>
                        <p className="text-sm text-quility-dark-grey">Click the button above to get AI-powered estimates based on the qualifier info.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotesTab;