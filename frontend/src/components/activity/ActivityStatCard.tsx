import React from 'react';
import Icon from '../common/Icon';

interface ActivityStatCardProps {
  icon: string;
  label: string;
  value: string | number;
  iconBgColor?: string;
}

const ActivityStatCard: React.FC<ActivityStatCardProps> = ({ icon, label, value, iconBgColor = 'bg-quility-light-green' }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-quility-border flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
        <Icon name={icon} size={24} className="text-quility-dark-green" />
      </div>
      <div>
        <p className="text-2xl font-bold text-quility-dark-text">{value}</p>
        <p className="text-sm text-quility-dark-grey">{label}</p>
      </div>
    </div>
  );
};

export default ActivityStatCard;
