
import React from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
}

const getInitials = (name: string) => {
  if (!name || typeof name !== 'string' || !name.trim()) return '';
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length > 1) {
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }
  if (nameParts.length === 1 && nameParts[0].length > 0) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  return '';
};


const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size = 48, className = '' }) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = getInitials(name);
  const bgColor = 'bg-quility'; // Changed to use the primary theme color for avatars

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white ${bgColor} ${className}`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
