
import React, { useState } from 'react';
import BulkActionModal from './BulkActionModal';
import { useMutation } from '@tanstack/react-query';
import { bulkUpdateLeads } from '../../../utils/lead-api';
import Icon from '../../common/Icon';

interface BulkAiToggleModalProps {
    leadIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

const BulkAiToggleModal: React.FC<BulkAiToggleModalProps> = ({ leadIds, onClose, onSuccess }) => {
    const [enableAi, setEnableAi] = useState<boolean>(true);

    const mutation = useMutation({
        mutationFn: () => bulkUpdateLeads({
            leadIds,
            action: 'toggle-ai',
            value: enableAi ? 1 : 0, // Backend expects 1 for true, 0 for false
        }),
        onSuccess: () => {
            onSuccess();
            onClose();
        },
        onError: (error) => {
            alert(`Error: ${error.message}`);
        },
    });

    const handleConfirm = () => {
        mutation.mutate();
    };

    return (
        <BulkActionModal
            title={`Update AI Assistant for ${leadIds.length} Leads`}
            onClose={onClose}
            onConfirm={handleConfirm}
            confirmText="Update Settings"
            isLoading={mutation.isPending}
        >
            <div className="space-y-6 p-2">
                <p className="text-quility-dark-grey text-sm">
                    Choose whether to enable or disable the AI Texting Assistant for the selected leads.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${enableAi ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                            type="radio"
                            name="aiToggle"
                            checked={enableAi}
                            onChange={() => setEnableAi(true)}
                            className="sr-only"
                        />
                        <Icon name="brain" size={32} className={enableAi ? 'text-purple-600' : 'text-gray-400'} />
                        <span className={`font-bold mt-2 ${enableAi ? 'text-purple-900' : 'text-gray-500'}`}>Enable AI</span>
                        <span className="text-xs text-center text-gray-500 mt-1">AI will respond to texts.</span>
                    </label>

                    <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${!enableAi ? 'border-quility-destructive bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                            type="radio"
                            name="aiToggle"
                            checked={!enableAi}
                            onChange={() => setEnableAi(false)}
                            className="sr-only"
                        />
                        <Icon name="x-circle-q" size={32} className={!enableAi ? 'text-quility-destructive' : 'text-gray-400'} />
                        <span className={`font-bold mt-2 ${!enableAi ? 'text-red-900' : 'text-gray-500'}`}>Disable AI</span>
                        <span className="text-xs text-center text-gray-500 mt-1">Stop AI responses.</span>
                    </label>
                </div>
            </div>
        </BulkActionModal>
    );
};

export default BulkAiToggleModal;
