

import React from 'react';
import Icon from './Icon'; // Import Icon component

interface OutlineButtonProps {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Allow MouseEvent
    disabled?: boolean;
    className?: string; // Added for more flexibility
    leftIcon?: string; // New: Optional icon to display on the left
    destructive?: boolean; // New: Added destructive prop
    rightContent?: React.ReactNode;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({ label, onClick, disabled, className = '', leftIcon, destructive, rightContent }) => (
     <button
        onClick={onClick}
        disabled={disabled}
        className={`h-10 px-6 text-base font-bold bg-transparent border-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-2
            ${destructive
                ? 'border-quility-destructive text-quility-destructive hover:bg-quility-destructive/10'
                : 'border-quility-border text-quility-dark-text hover:bg-quility-button/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}`}
    >
        {leftIcon && <Icon name={leftIcon} size={18} />}
        {label}
        {rightContent}
    </button>
);

export default OutlineButton;