import React from 'react';
import Icon from './Icon';

interface PrimaryButtonProps {
    label: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // FIX: Added MouseEvent to onClick signature
    disabled?: boolean;
    destructive?: boolean;
    leftIcon?: string;
    rightContent?: React.ReactNode; // FIX: Added rightContent prop
    className?: string; // Added for more flexibility
    type?: 'button' | 'submit' | 'reset'; // FIX: Added type prop
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onClick, disabled, destructive, leftIcon, rightContent, className = '', type = 'button' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`h-10 px-6 text-base font-bold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2
            ${destructive ? 'bg-quility-destructive text-white hover:bg-quility-destructive-hover focus:ring-quility-destructive' : 'bg-quility-button text-quility-light-text hover:bg-quility-button-hover focus:ring-quility-button'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}`}
        type={type} // FIX: Pass type prop
    >
        {leftIcon && <Icon name={leftIcon} size={18} />}
        {label}
        {rightContent} {/* FIX: Render rightContent here */}
    </button>
);

export default PrimaryButton;