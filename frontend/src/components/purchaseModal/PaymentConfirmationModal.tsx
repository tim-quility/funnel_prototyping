import React, { useState } from 'react';
import Icon from '../common/Icon';
import type { PaymentMethod } from '../../types';

interface PaymentConfirmationModalProps {
  itemName: string;
  totalPrice: number;
  paymentMethods: PaymentMethod[];
  onConfirm: (paymentMethodId: string) => void;
  onClose: () => void;
  confirmButtonText?: string;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({ itemName, totalPrice, paymentMethods, onConfirm, onClose, confirmButtonText }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleConfirm = () => {
    if (selectedPaymentMethod) {
      onConfirm(selectedPaymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h3 className="text-lg leading-6 font-bold text-quility-dark-text" id="modal-title">
            Confirm Your Purchase
        </h3>
        <div className="mt-4 space-y-4">
            <div className="p-3 bg-quility-accent-bg rounded-md">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-quility-dark-grey">{itemName}</span>
                    <span className="font-semibold text-quility-dark-text">${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-quility-dark-text">
                    Payment Method
                </label>
                <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-quility-border focus:outline-none focus:ring-quility focus:border-quility sm:text-sm rounded-md text-quility-dark-grey"
                >
                    <option value="" disabled>Select a card</option>
                    {paymentMethods.map(pm => (
                        <option key={pm.id} value={pm.id}>
                            {pm.cardType} ending in {pm.last4}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        <div className="mt-6 sm:flex sm:flex-row-reverse">
            <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedPaymentMethod}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-quility-button text-base font-medium text-white hover:bg-quility-button-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quility sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {confirmButtonText || `Confirm & Pay $${totalPrice.toFixed(2)}`}
            </button>
            <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-quility-border shadow-sm px-4 py-2 bg-white text-base font-medium text-quility-dark-text hover:bg-quility-accent-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quility sm:mt-0 sm:w-auto sm:text-sm"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;