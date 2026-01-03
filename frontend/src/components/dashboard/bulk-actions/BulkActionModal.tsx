import React from 'react';
import Icon from '../../common/Icon';
import PrimaryButton from '../../common/PrimaryButton';
import OutlineButton from '../../common/OutlineButton';

interface BulkActionModalProps {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    children: React.ReactNode;
    isConfirmDisabled?: boolean;
    isLoading?: boolean;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
    title,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    children,
    isConfirmDisabled = false,
    isLoading = false
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col max-h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b border-quility-border flex justify-between items-center bg-quility-accent-bg rounded-t-lg">
                    <h2 className="text-xl font-bold text-quility-dark-text">{title}</h2>
                    <button onClick={onClose} className="p-1 text-quility-dark-grey hover:text-quility-destructive">
                        <Icon name="x-close-q" size={20} />
                    </button>
                </header>

                <main className="flex-grow p-6 overflow-y-auto">
                    {children}
                </main>

                <footer className="flex-shrink-0 p-4 border-t border-quility-border flex justify-end items-center gap-3 bg-quility-accent-bg rounded-b-lg">
                    <OutlineButton onClick={onClose} label="Cancel" />
                    <PrimaryButton
                        onClick={onConfirm}
                        label={isLoading ? 'Processing...' : confirmText}
                        disabled={isConfirmDisabled || isLoading}
                    />
                </footer>
            </div>
        </div>
    );
};

export default BulkActionModal;
