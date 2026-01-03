import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';

const LiveTransferToggle: React.FC = () => {
    const { isLiveTransferActive, toggleLiveTransferStatus } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className="relative">
            <button
                onClick={() => setIsOpen(p => !p)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors border-2 ${
                    isLiveTransferActive
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-gray-100 border-gray-300 text-gray-800'
                }`}
            >
                <span className={`w-2.5 h-2.5 rounded-full ${isLiveTransferActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                Live Transfers: {isLiveTransferActive ? 'Online' : 'Offline'}
            </button>
            {isOpen && (
                 <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-quility-border z-10 p-4">
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-quility-dark-text">Accepting Live Calls</div>
                        <button
                            type="button"
                            onClick={toggleLiveTransferStatus}
                            className={`${isLiveTransferActive ? 'bg-quility-dark-green' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                        >
                            <span className={`${isLiveTransferActive ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                        </button>
                    </div>
                    <p className="text-xs text-quility-dark-grey mt-2">
                        {isLiveTransferActive
                            ? "You are online and will receive incoming live transfer calls."
                            : "You are offline and will not receive any calls."
                        }
                    </p>
                 </div>
            )}
        </div>
    );
};

export default LiveTransferToggle;