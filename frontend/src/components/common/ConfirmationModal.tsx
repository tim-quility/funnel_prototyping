import React from 'react';
import Icon from './Icon';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string | null;
  onConfirm: () => void;
  onClose: () => void;
  destructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onClose, destructive = true }) => {
  const confirmButtonClasses = destructive
    ? 'bg-quility-destructive text-white hover:bg-quility-destructive-hover focus:ring-red-500'
    : 'bg-quility-button text-white hover:bg-quility-button-hover focus:ring-quility';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <div className="flex items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${destructive ? 'bg-red-100' : 'bg-quility-light-green'} sm:mx-0 sm:h-10 sm:w-10`}>
                <Icon name="alert-triangle" size={24} className={destructive ? "text-red-600" : "text-quility-dark-green"} />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-bold text-quility-dark-text" id="modal-title">
                    {title}
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-quility-dark-grey">
                        {message}
                    </p>
                </div>
            </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
                type="button"
                onClick={() => { onConfirm(); onClose(); }}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonClasses}`}
            >
                {confirmText}
            </button>
            {cancelText && (
                 <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-quility-border shadow-sm px-4 py-2 bg-white text-base font-medium text-quility-dark-text hover:bg-quility-accent-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quility sm:mt-0 sm:w-auto sm:text-sm"
                >
                    {cancelText}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;