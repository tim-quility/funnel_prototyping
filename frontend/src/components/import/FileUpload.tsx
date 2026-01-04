import React, { useState, useCallback } from 'react';
import Button from '../q_design/Button';
import Icon from '../common/Icon';

// Basic CSV parser
const parseCSV = (text: string): { headers: string[], data: { [key: string]: string }[] } => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
        // This is a simple parser, doesn't handle commas inside quotes well.
        // For a real app, a library like PapaParse would be better.
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {} as { [key: string]: string });
    });
    return { headers, data };
};

interface FileUploadProps {
  onFileUploaded: (headers: string[], data: { [key: string]: string }[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (file && file.type === 'text/csv') {
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { headers, data } = parseCSV(text);
        if (headers.length > 0 && data.length > 0) {
          onFileUploaded(headers, data);
        } else {
          setError('Could not parse CSV. Ensure it has a header row and at least one data row.');
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a valid .csv file.');
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileUploaded]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold text-quility-dark-text">Upload Your CSV File</h2>
        <p className="mt-2 text-sm text-quility-dark-grey">
            Your file should have a header row with column names.
        </p>

        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`mt-6 p-10 border-2 border-dashed rounded-lg transition-colors
                ${isDragging ? 'border-quility bg-quility-light-hover' : 'border-quility-border hover:border-quility'}
            `}
        >
            <Icon name="upload-cloud" size={48} className="mx-auto text-quility-dark-grey" />
            <p className="mt-4 font-semibold text-quility-dark-text">Drag and drop your file here</p>
            <p className="mt-1 text-xs text-quility-dark-grey">or</p>
            <div className="mt-2">
                <Button hierarchy="primary" onClick={() => document.getElementById('file-upload')?.click()}>
                    Browse Files
                </Button>
            </div>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
        </div>
         {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Add upload-cloud icon to Icon component if it doesn't exist. For now, assuming it does.
// In a real scenario, I would add the SVG path for 'upload-cloud' to the Icon component.
const IconWithUpload = (props: any) => {
    if (props.name === 'upload-cloud') {
         return (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        )
    }
    return <Icon {...props} />;
}


export default FileUpload;