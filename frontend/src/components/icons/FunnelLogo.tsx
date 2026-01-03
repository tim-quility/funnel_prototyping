import React from 'react';

const FunnelLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-auto"}>
      <defs>
        <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'var(--color-quility-dark-green)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-quility-extra-dark-green)' }} />
        </linearGradient>
      </defs>
      {/* A more modern, abstract funnel shape */}
      <path d="M 5,5 H 45 L 35,35 H 15 Z" fill="url(#funnelGradient)" />
      <text
        x="55"
        y="35"
        fontFamily="mont, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="var(--color-quility-dark-green)">
        Funnel
      </text>
    </svg>
  );
};

export default FunnelLogo;
