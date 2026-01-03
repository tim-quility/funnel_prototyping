
import React from 'react';
import Icon from '../common/Icon';
import PrimaryButton from '../common/PrimaryButton'; // Reusing existing button

interface ImportSummaryProps {
  summary: {
    success: number;
    failed: number;
  };
  failedRows: any[]; // Array of rows that failed
  onStartOver: () => void;
}

const ImportSummary: React.FC<ImportSummaryProps> = ({ summary, failedRows, onStartOver }) => {
  
  const handleDownloadFailed = () => {
      if (failedRows.length === 0) return;

      // 1. Extract Headers (keys of the first object)
      const headers = Object.keys(failedRows[0]);
      
      // 2. Create CSV content
      const csvContent = [
          headers.join(','), // Header row
          ...failedRows.map(row => 
              headers.map(fieldName => {
                  let value = row[fieldName] || '';
                  // Escape quotes and wrap in quotes if contains comma
                  if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                       value = `"${value.replace(/"/g, '""')}"`;
                  }
                  return value;
              }).join(',')
          )
      ].join('\n');

      // 3. Trigger Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `failed_import_rows_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="max-w-lg mx-auto text-center py-10">
        <div className="w-16 h-16 bg-quility-light-green rounded-full flex items-center justify-center mx-auto">
            <Icon name="checkmark-q" size={40} className="text-quility-dark-green" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-quility-dark-text">Import Complete!</h2>
        <p className="mt-2 text-quility-dark-grey">Your leads have been processed.</p>

        <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{summary.success}</p>
                <p className="text-sm font-semibold text-quility-dark-grey">Leads Imported</p>
            </div>
            {summary.failed > 0 && (
                <div className="text-center">
                    <p className="text-3xl font-bold text-red-500">{summary.failed}</p>
                    <p className="text-sm font-semibold text-quility-dark-grey">Rows Skipped</p>
                </div>
            )}
        </div>
        
        <div className="mt-10 space-y-4">
            {summary.failed > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-3">
                        {summary.failed} rows were skipped due to missing required fields.
                    </p>
                    <button 
                        onClick={handleDownloadFailed}
                        className="text-sm font-bold text-red-700 hover:text-red-900 underline flex items-center justify-center gap-2 mx-auto"
                    >
                        <Icon name="file-down-q" size={16} />
                        Download Failed Rows CSV
                    </button>
                </div>
            )}

            <PrimaryButton
                onClick={onStartOver}
                label="Import Another File"
                className="w-full"
            />
        </div>
    </div>
  );
};

export default ImportSummary;
