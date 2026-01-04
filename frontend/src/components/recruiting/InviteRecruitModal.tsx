import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { Recruit } from '../../types';

interface InviteRecruitModalProps {
    onClose: () => void;
    // Corrected the Omit type for the `onAddRecruit` prop to match what the parent component expects.
    // The modal is only responsible for collecting name, email, and phone.
    onAddRecruit: (recruit: Omit<Recruit, 'id' | 'stage' | 'applyDate' | 'source' | 'state' | 'hasLicense' | 'licensedStates' | 'notes'>) => void;
}

const InviteRecruitModal: React.FC<InviteRecruitModalProps> = ({ onClose, onAddRecruit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && (email || phone)) {
            onAddRecruit({ name, email, phone });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                 <div className="p-6 border-b border-quility-border">
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Add New Recruit</h2>
                    <p className="text-sm text-quility-dark-grey mt-1">Add a new prospect to your recruiting pipeline.</p>
                </div>

                <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-quility-dark-text mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full h-10 px-3 text-base border rounded-md bg-quility-input-bg border-quility-border text-quility-dark-grey"
                        />
                    </div>
                    {!email && !phone && <p className="text-xs text-red-500">Please provide at least an email or a phone number.</p>}
                </div>

                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="h-10 px-6 text-base font-bold bg-white border-2 border-quility-border text-quility-dark-text rounded-md hover:bg-quility-hover-grey">
                        Cancel
                    </button>
                    <button type="submit" disabled={!name || (!email && !phone)} className="h-10 px-6 text-base font-bold rounded-md bg-quility-button text-quility-light-text hover:bg-quility-button-hover disabled:opacity-50">
                        Add to Pipeline
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InviteRecruitModal;