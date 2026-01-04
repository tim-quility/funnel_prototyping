import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import Button from '../q_design/Button'; 
import InputTextField from '../common/InputTextField'; 
import type { LeadProduct } from '../../types';

interface PurchaseModalProps {
  product: LeadProduct;
  onClose: () => void;
  onConfirmPurchase: (details: { product: LeadProduct, quantity: number, totalPrice: number }) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose, onConfirmPurchase }) => {
    const [quantity, setQuantity] = useState(product.minQuantity);
    const [states, setStates] = useState('');

    const statesArray = useMemo(() => states.split(',').map(s => s.trim()).filter(Boolean), [states]);

    const quantityError = quantity < product.minQuantity;
    const statesError = statesArray.length < product.minStates;
    const canPurchase = !quantityError && !statesError;
    const totalPrice = quantity * product.pricePerLead;

    const handlePurchase = () => {
        if (canPurchase) {
            onConfirmPurchase({ product, quantity, totalPrice });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
                <div className="p-6 border-b border-quility-border">
                    <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-quility-destructive transition-colors">
                        <Icon name="x-circle-q" size={28} />
                    </button>
                    <h2 className="text-xl font-bold text-quility-dark-text">Purchase Leads</h2>
                    <p className="text-quility-dark-grey">{product.name}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <InputTextField
                            label="Quantity"
                            type="number"
                            value={String(quantity)}
                            onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                            error={quantityError ? `Minimum quantity is ${product.minQuantity}.` : undefined}
                            min={String(product.minQuantity)} // input type="number" requires string for min
                        />
                    </div>
                     <div>
                        <InputTextField
                            label="States"
                            type="text"
                            value={states}
                            onChange={e => setStates(e.target.value)}
                            placeholder="e.g., FL, GA, TX"
                            error={statesError ? `Minimum ${product.minStates} state(s) required.` : undefined}
                        />
                    </div>
                    <div className="pt-4 border-t border-quility-border text-right">
                        <p className="text-quility-dark-grey">Total Price</p>
                        <p className="text-2xl font-bold text-quility-dark-text">${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div className="p-4 bg-quility-accent-bg rounded-b-lg flex justify-end">
                    <Button
                        onClick={handlePurchase}
                        disabled={!canPurchase}
                        label="Proceed to Confirmation"
                    />
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;