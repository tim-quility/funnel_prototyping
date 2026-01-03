import React, { useState } from 'react';
import Icon from '../../common/Icon';
import PrimaryButton from '../../common/PrimaryButton';
import OutlineButton from '../../common/OutlineButton';
import InputTextField from '../../common/InputTextField';

interface SaveFilterModalProps {
    onClose: () => void;
    onSave: (name: string) => void;
}

const SaveFilterModal: React.FC<SaveFilterModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up">
                <div className="p-6 border-b border-quility-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-quility-dark-text">Save Current Filter</h2>
                    <button onClick={onClose} className="text-quility-dark-grey hover:text-quility-destructive">
                        <Icon name="x-close-q" size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <InputTextField
                        label="Filter Name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        placeholder="e.g., Hot Leads in CA"
                        required
                    />
                </div>

                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end gap-3">
                    <OutlineButton label="Cancel" onClick={onClose} />
                    <PrimaryButton
                        label="Save"
                        onClick={handleSave}
                        disabled={!name.trim()}
                    />
                </div>
            </div>
        </div>
    );
};

export default SaveFilterModal;