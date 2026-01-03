import React, { useRef, useEffect } from 'react';
import Icon from './Icon';

interface PopoverProps {
    onClose: () => void;
    headerContent: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    anchorEl?: HTMLElement | null;
}

const Popover: React.FC<PopoverProps> = ({ onClose, headerContent, children, className = '', anchorEl }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <>
            <div
                ref={popoverRef}
                className={`absolute top-full left-0 mt-2 w-72 bg-white border border-quility-border rounded-lg shadow-xl z-30 animate-scale-in-fast ${className}`}
            >
                <div className="p-3 border-b border-quility-border flex justify-between items-center">
                    {headerContent}
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-quility-accent-bg">
                        <Icon name="x-close-q" size={16} className="text-quility-dark-grey" />
                    </button>
                </div>
                <div className="p-2">
                    {children}
                </div>
            </div>
            <style>{`
                @keyframes scale-in-fast {
                    from { opacity: 0; transform: scale(0.98) translateY(-4px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-scale-in-fast {
                    animation: scale-in-fast 0.1s ease-out;
                }
            `}</style>
        </>
    );
};

export default Popover;