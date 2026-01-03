import React from 'react';
import Icon from '../common/Icon';
import { LEAD_FIELDS_FOR_MAPPING } from '../../constants';
import type { Mapping } from '../../types';

type CSVRow = { [key: string]: string };

interface DataPreviewProps {
  headers: string[];
  data: CSVRow[];
  mapping: Mapping;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({ headers, data, mapping, onConfirm, onBack, isLoading = false }) => {
    const previewData = data.slice(0, 5); // Show first 5 rows
    
    const mappedHeaders = Object.entries(mapping)
        .filter(([csvHeader, dbField]) => dbField && headers.includes(csvHeader))
        .map(([csvHeader, dbField]) => ({
            csvHeader,
            label: LEAD_FIELDS_FOR_MAPPING.find(f => f.value === dbField)?.label || dbField,
        }));

    return (
        <div className="max-w-6xl mx-auto">
             <h2 className="text-xl font-bold text-quility-dark-text">Preview Your Data</h2>
            <p className="mt-2 text-sm text-quility-dark-grey">
                Here's a look at the first few rows of your data with the current mappings. Does everything look correct?
            </p>

            <div className="mt-6 border border-quility-border rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-quility-border">
                    <thead className="bg-quility-accent-bg">
                        <tr>
                            {mappedHeaders.map(({ label }) => (
                                <th key={label} scope="col" className="px-4 py-3 text-left text-xs font-bold text-quility-dark-text uppercase tracking-wider">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-quility-border">
                        {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {mappedHeaders.map(({ csvHeader, label }) => (
                                    <td key={`${rowIndex}-${label}`} className="px-4 py-3 whitespace-nowrap text-sm text-quility-dark-text">
                                        {row[csvHeader]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length > 5 && (
                <p className="mt-2 text-xs text-quility-dark-grey text-right">... and {data.length - 5} more rows.</p>
            )}

            <div className="mt-8 flex justify-between items-center">
                <button onClick={onBack} disabled={isLoading} className="px-6 py-2 text-base font-bold bg-transparent border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey disabled:opacity-50">
                    Back to Mapping
                </button>
                <button 
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-6 py-2 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover flex items-center gap-2 disabled:opacity-75"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Importing...
                        </>
                    ) : (
                         `Yes, Import ${data.length} Leads`
                    )}
                </button>
            </div>
        </div>
    );
};

export default DataPreview;