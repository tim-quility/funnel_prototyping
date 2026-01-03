import React from 'react';

export type DateRange = 'today' | '7' | '30' | 'month' | 'custom';

interface DateRangePickerProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const ranges: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom' },
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({ selectedRange, onRangeChange }) => {
  return (
    <div className="flex items-center bg-white border border-quility-border rounded-lg p-1">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onRangeChange(value)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200
            ${selectedRange === value
              ? 'bg-quility-dark-green text-white shadow-sm'
              : 'text-quility-dark-grey hover:bg-quility-accent-bg'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DateRangePicker;