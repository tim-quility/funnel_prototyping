import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface LiveCallBannerProps {
    onAccept: () => void;
    onReject: () => void;
}

const LiveCallBanner: React.FC<LiveCallBannerProps> = ({ onAccept, onReject }) => {
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        if (countdown <= 0) {
            onReject();
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, onReject]);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 bg-quility-dark-green text-white p-3 shadow-lg flex items-center justify-center gap-6"
            style={{ animation: 'fadeInDown 0.5s ease-out forwards' }}
        >
            <style>
                {`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
            <Icon name="phone-forwarded" size={28} className="animate-pulse" />
            <div className="text-center">
                <p className="font-bold text-lg">Incoming Live Transfer!</p>
                <p className="text-sm opacity-80">Final Expense Lead from (555) 123-4567</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onAccept}
                    className="px-6 py-2 font-bold bg-green-500 hover:bg-green-600 rounded-md flex items-center gap-2"
                >
                    <Icon name="q-phone-call" size={18} />
                    Accept ({countdown}s)
                </button>
                 <button onClick={onReject} className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full">
                    <Icon name="x-circle-q" size={20} />
                </button>
            </div>
        </div>
    );
};

export default LiveCallBanner;
