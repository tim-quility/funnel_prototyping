import React from 'react';
import Icon from './Icon';

interface InputTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // FIX: Added onKeyPress prop
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void; // Add onFocus prop
  error?: string;
  helperText?: string;
  type?: string;
  disabled?: boolean;
  leftIcon?: string;
  placeholder?: string;
  className?: string;
  min?: string;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>; // Add inputRef prop
}

const InputTextField: React.FC<InputTextFieldProps> = ({ label, value, onChange, onBlur, onKeyPress, onFocus, error, helperText, type = 'text', disabled, leftIcon, placeholder, className, min, required, inputRef }) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1 text-quility-dark-text">{label}</label>
    <div className="relative">
      {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon name={leftIcon} size={20} className="text-quility-dark-grey" /></div>}
      <input
        ref={inputRef} // Pass ref to input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress} // FIX: Pass onKeyPress prop
        onFocus={onFocus} // Pass onFocus prop
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full h-11 px-3 ${leftIcon ? 'pl-10' : ''} text-base border rounded-md bg-quility-input-bg focus:outline-none focus:ring-2 text-quility-dark-text placeholder:text-quility-dark-grey ${error ? 'border-quility-destructive focus:ring-quility-destructive/50' : 'border-quility-border focus:ring-quility-button/50'} ${className}`}
        min={min}
        required={required}
      />
    </div>
    {error && <p className="text-sm text-quility-destructive mt-1">{error}</p>}
    {helperText && !error && <p className="text-sm text-quility-dark-grey mt-1">{helperText}</p>}
  </div>
);

export default InputTextField;