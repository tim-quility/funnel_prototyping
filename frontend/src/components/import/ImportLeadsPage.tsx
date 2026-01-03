
import React, { useState } from 'react';
import Icon from '../common/Icon';
import FileUpload from './FileUpload';
import FieldMapper from './FieldMapper';
import StatusMapper from './StatusMapper';
import DataPreview from './DataPreview';
import ImportSummary from './ImportSummary';
import type { Mapping, MappingProfile } from '../../types';
import { REQUIRED_IMPORT_FIELDS } from '../../constants';
import TypeMapper from './TypeMapper';
import { useAuth } from '../../context/AuthContext';
import { importLeadsCSV } from '../../utils/import-api';

// Added 'status_mapping' step
type ImportStep = 'upload' | 'mapping' | 'type_mapping' | 'status_mapping' | 'preview' | 'importing' | 'complete';
type CSVRow = { [key: string]: string };

const StepIndicator: React.FC<{ currentStep: ImportStep }> = ({ currentStep }) => {
    const steps: { id: ImportStep, name: string }[] = [
        { id: 'upload', name: 'Upload File' },
        { id: 'mapping', name: 'Map Fields' },
        { id: 'type_mapping', name: 'Map Lead Type' },
        { id: 'status_mapping', name: 'Map Statuses' },
        { id: 'preview', name: 'Preview & Confirm' },
        { id: 'complete', name: 'Import Complete' },
    ];

    const getStepIndex = (s: ImportStep) => {
        if (s === 'importing') return steps.findIndex(x => x.id === 'preview');
        return steps.findIndex(x => x.id === s);
    }
    
    const currentStepIndex = getStepIndex(currentStep);

    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-center">
                {steps.map((step, stepIdx) => {
                    const isCompleted = stepIdx < currentStepIndex;
                    const isCurrent = stepIdx === currentStepIndex;
                    const isLast = stepIdx === steps.length - 1;

                    return (
                        <li key={step.name} className={`relative ${!isLast ? 'pr-8 sm:pr-20' : ''}`}>
                            {/* Connector Line - Rendered behind the dot */}
                            {!isLast && (
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className={`h-0.5 w-full ${isCompleted ? 'bg-quility' : 'bg-gray-200'}`} />
                                </div>
                            )}

                            {/* Dot & Label Wrapper - Ensures text centers to the DOT, not the LI */}
                            <div className="relative flex flex-col items-center group">
                                <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                    isCompleted ? 'bg-quility border-quility' : 
                                    isCurrent ? 'bg-white border-quility' : 
                                    'bg-white border-gray-300'
                                }`}>
                                    {isCompleted && (
                                        <Icon name="checkmark-q" size={20} className="text-white" />
                                    )}
                                    {isCurrent && (
                                        <span className="h-2.5 w-2.5 bg-quility rounded-full" />
                                    )}
                                </span>

                                {/* Label - Absolute relative to the Wrapper above */}
                                <span className="absolute top-10 left-5/2 -translate-x-1/2 w-32 text-center text-xs font-semibold text-quility-dark-text">
                                    {step.name}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

const ImportLeadsPage: React.FC = () => {
    const { agent } = useAuth();
    const [step, setStep] = useState<ImportStep>('upload');
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [mapping, setMapping] = useState<Mapping>({});
    
    // New State for Status Mapping
    const [uniqueCsvStatuses, setUniqueCsvStatuses] = useState<string[]>([]);
    const [statusMapping, setStatusMapping] = useState<Record<string, number>>({});

    const [importSummary, setImportSummary] = useState({ success: 0, failed: 0 });
    const [failedRows, setFailedRows] = useState<(CSVRow & { failureReason: string })[]>([]);
    const [uniqueCsvTypes, setUniqueCsvTypes] = useState<string[]>([]);
    const [leadTypeMapping, setLeadTypeMapping] = useState<Record<string, string> | string>('');

    const handleFileUploaded = (headers: string[], data: CSVRow[]) => {
        setCsvHeaders(headers);
        setCsvData(data);
        setMapping({});
        setStatusMapping({});
        setStep('mapping');
    };
    const handleTypeMappingComplete = (result: Record<string, string> | string) => {
        setLeadTypeMapping(result);

        // Determine if status mapping is needed
        const statusHeader = Object.keys(mapping).find(key => mapping[key] === 'lead_status');
        if (statusHeader) {
            const uniqueStatuses = Array.from(new Set(csvData.map(row => row[statusHeader] || '').map(s => s.trim()))).filter(Boolean);
            if (uniqueStatuses.length > 0) {
                setUniqueCsvStatuses(uniqueStatuses);
                setStep('status_mapping');
                return;
            }
        }
        setStep('preview');
    };
    const handleMappingComplete = (finalMapping: Mapping) => {
        setMapping(finalMapping);
        
        // Find if lead type is mapped
        const typeHeader = Object.keys(finalMapping).find(key => finalMapping[key] === 'lead_type');
        if (typeHeader) {
            const uniqueTypes = Array.from(new Set(csvData.map(row => row[typeHeader] || '').map(s => s.trim()))).filter(Boolean);
            setUniqueCsvTypes(uniqueTypes);
        } else {
            setUniqueCsvTypes([]);
        }
        setStep('type_mapping');
    };

    const handleStatusMappingComplete = (finalStatusMap: Record<string, number>) => {
        setStatusMapping(finalStatusMap);
        setStep('preview');
    };
    
    const handleConfirmImport = async () => {
        setStep('importing');

        const valid: any[] = [];
        const failed: (CSVRow & { failureReason: string })[] = [];

        const dbToCsvMap: { [key: string]: string } = {};
        Object.entries(mapping).forEach(([csvHeader, dbField]) => {
            if (dbField) dbToCsvMap[dbField as string] = csvHeader;
        });

        const statusHeader = dbToCsvMap['lead_status']; // Adjusted to match field name usually mapped
        const leadTypeHeader = dbToCsvMap['lead_type'];

        csvData.forEach((row) => {
            const missingFields: string[] = [];
            
            REQUIRED_IMPORT_FIELDS.forEach(reqField => {
                const csvHeader = dbToCsvMap[reqField];
                if (!csvHeader || !row[csvHeader] || !row[csvHeader].trim()) {
                    missingFields.push(reqField);
                }
            });

            if (missingFields.length > 0) {
                failed.push({ 
                    ...row, 
                    failureReason: `Missing required fields: ${missingFields.join(', ')}` 
                });
            } else {
                const mappedRow: any = { ...row };
                
                // Handle Status Injection
                if (statusHeader && row[statusHeader]) {
                    const csvStatusVal = row[statusHeader].trim();
                    const systemStatusId = statusMapping[csvStatusVal];
                    if (systemStatusId) {
                        mappedRow['__system_status_id'] = systemStatusId; 
                    }
                }

                // Handle Lead Type Injection if using global default
                if (typeof leadTypeMapping === 'string' && leadTypeMapping !== '') {
                    mappedRow['lead_type'] = leadTypeMapping;
                } else if (typeof leadTypeMapping === 'object' && leadTypeHeader && row[leadTypeHeader]) {
                    // Mapped specific values
                    const csvTypeVal = row[leadTypeHeader].trim();
                    if(leadTypeMapping[csvTypeVal]) {
                        mappedRow['lead_type'] = leadTypeMapping[csvTypeVal];
                    }
                }
                
                valid.push(mappedRow);
            }
        });

        setFailedRows(failed);

        // If no valid rows, skip backend call
        if (valid.length === 0) {
            setImportSummary({ success: 0, failed: failed.length });
            setStep('complete');
            return;
        }

        try {
            await importLeadsCSV({
                leads: valid,
                mapping: mapping,
                agentId: agent?.agentId || 0
            });
            setImportSummary({ success: valid.length, failed: failed.length });
            setStep('complete');
        } catch (error: any) {
            console.error("Import failed", error);
            alert(`Import Failed: ${error.message}`);
            setStep('preview'); // Go back to preview to retry
        }
    };
    
    const handleStartOver = () => {
        setCsvHeaders([]);
        setCsvData([]);
        setMapping({});
        setFailedRows([]);
        setStatusMapping({});
        setStep('upload');
    };
    
    const renderContent = () => {
        switch(step) {
            case 'upload':
                return <FileUpload onFileUploaded={handleFileUploaded} />;
            case 'mapping':
                return <FieldMapper csvHeaders={csvHeaders} onMappingComplete={handleMappingComplete} onCancel={handleStartOver} />;
            case 'type_mapping':
                return <TypeMapper uniqueCsvValues={uniqueCsvTypes} onComplete={handleTypeMappingComplete} onBack={() => setStep('mapping')} />;
            case 'status_mapping':
                return <StatusMapper uniqueCsvValues={uniqueCsvStatuses} onComplete={handleStatusMappingComplete} onBack={() => setStep('type_mapping')} />;
            case 'preview':
                return <DataPreview headers={csvHeaders} data={csvData} mapping={mapping} onConfirm={handleConfirmImport} onBack={() => setStep('status_mapping')} />;
            case 'importing':
                return <DataPreview headers={csvHeaders} data={csvData} mapping={mapping} onConfirm={() => {}} onBack={() => {}} isLoading={true} />;
            case 'complete':
                return <ImportSummary summary={importSummary} failedRows={failedRows} onStartOver={handleStartOver} />;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex items-center">
                <Icon name="repeat-q" size={26} className="text-quility-dark-text" />
                <h1 className="text-2xl font-bold text-quility-dark-text ml-3">Import Leads via CSV</h1>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-quility-border">
                <div className="mb-14 pt-4 px-4">
                    <StepIndicator currentStep={step} />
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default ImportLeadsPage;
