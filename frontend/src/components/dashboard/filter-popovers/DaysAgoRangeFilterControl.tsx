
import React, { useState } from 'react';

interface DaysAgoRangeFilterControlProps {
    value: { min: number | null; max: number | null };
    onChange: (newValue: { min: number | null; max: number | null }) => void;
}

const DaysAgoRangeFilterControl: React.FC<DaysAgoRangeFilterControlProps> = ({ value, onChange }) => {
    const [min, setMin] = useState(value.min !== null ? String(value.min) : '');
    const [max, setMax] = useState(value.max !== null ? String(value.max) : '');

    const handleApply = () => {
        const minVal = min.trim() === '' ? null : parseInt(min, 10);
        const maxVal = max.trim() === '' ? null : parseInt(max, 10);
        // Ensure min is always the larger number of days (older)
        const finalMin = (minVal !== null && maxVal !== null) ? Math.max(minVal, maxVal) : minVal;
        const finalMax = (minVal !== null && maxVal !== null) ? Math.min(minVal, maxVal) : maxVal;
        onChange({ min: finalMin, max: finalMax });
    };

    return (
        <div className="p-2 space-y-3">
            <p className="text-xs text-quility-dark-grey">Show leads assigned between...</p>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={min}
                    onChange={e => setMin(e.target.value)}
                    placeholder="e.g. 7"
                    className="w-full h-9 px-2 text-sm border rounded-md bg-white border-quility-border text-center"
                    min="0"
                />
                <span className="text-sm text-quility-dark-grey">and</span>
                <input
                    type="number"
                    value={max}
                    onChange={e => setMax(e.target.value)}
                    placeholder="e.g. 0"
                    className="w-full h-9 px-2 text-sm border rounded-md bg-white border-quility-border text-center"
                    min="0"
                />
            </div>
             <p className="text-xs text-quility-dark-grey">days ago. (e.g., from 7 to 0 for the last week)</p>
            <button
                onClick={handleApply}
                className="w-full h-9 text-sm font-bold bg-quility-button text-white rounded-md"
            >
                Apply
            </button>
        </div>
    );
};

export default DaysAgoRangeFilterControl;
