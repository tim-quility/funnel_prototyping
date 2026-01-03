import React, { useEffect, useState } from 'react';
import Icon from './Icon';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleClose = () => {
    setVisible(false);
    // Allow animation to finish before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${visible ? 'transform-none opacity-100' : 'translate-y-4 opacity-0'}`
      }
    >
      <div className="flex items-center gap-4 bg-quility-dark-green text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
        <Icon name="checkmark-q" size={20} className="text-quility-light-green" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;