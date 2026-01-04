

import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import type { RecruitingBadge } from '../../types';


interface NewBadgeAlertProps {
  badge: RecruitingBadge;
  onDismiss: () => void;
}

const NewBadgeAlert: React.FC<NewBadgeAlertProps> = ({ badge, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const newBadge={
      id: '1',
      name: 'First Recruit',
      description: 'You got your first recruit',
      icon: null,
      earned: true,
    }
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismissClick();
    }, 10000); // Auto-dismiss after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDismissClick = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Allow fade-out animation
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0, transform: `translate(-50%, ${isVisible ? '0' : '-200%'})` }}
    >
      
      <div className="relative bg-white border border-quility-dark-green shadow-xl rounded-2xl p-6 flex items-center gap-4 animate-scale-in-fast overflow-hidden">
        <style>{`
          @keyframes scale-in-fast {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scale-in-fast {
            animation: scale-in-fast 0.2s ease-out;
          }
        `}</style>
        
        <div className="relative z-10 w-16 h-16 rounded-full bg-quility-dark-green flex items-center justify-center flex-shrink-0">
          <Icon name={badge.icon} size={32} className="text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-quility-dark-green">{badge.name} Badge Earned!</h3>
          <p className="text-sm text-quility-dark-text mt-1">{badge.name}: {badge.description}</p>
        </div>
        <button
          onClick={handleDismissClick}
          className="absolute top-2 right-2 p-1.5 rounded-full text-quility-dark-grey hover:bg-quility-accent-bg z-20"
          title="Dismiss"
        >
          <Icon name="x-close-q" size={18} />
        </button>
      </div>
    </div>
  );
};

export default NewBadgeAlert;