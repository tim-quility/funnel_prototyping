

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../themes';

const ConfettiOverlay: React.FC = () => {
  const { theme: currentThemeId } = useTheme();
  const theme = themes.find(t => t.id === currentThemeId) || themes[0];

  // Use theme colors for confetti if available, otherwise fallback
  const confettiColor1 = theme.colors['quility-light-green'] || '#cbfbef';
  const confettiColor2 = theme.colors['quility-dark-green'] || '#005851';
  const confettiColor3 = theme.colors['quility-default'] || '#45bcaa';

  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically create and clean up confetti elements
  useEffect(() => {
    const createConfetti = (count: number) => {
      if (!containerRef.current) return;
      const fragments = [];
      const colors = [confettiColor1, confettiColor2, confettiColor3];

      for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'confetti-fragment';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.left = `${Math.random() * 100}vw`;
        div.style.animationDelay = `${Math.random() * 0.5}s`; // Stagger animation
        div.style.animationDuration = `${1.5 + Math.random() * 1}s`; // Vary duration
        fragments.push(div);
      }
      fragments.forEach(f => containerRef.current?.appendChild(f));

      // Clean up after animation
      const cleanupTimer = setTimeout(() => {
        fragments.forEach(f => f.remove());
      }, 2500); // Match total animation duration

      return () => clearTimeout(cleanupTimer);
    };

    createConfetti(100); // Create 100 confetti pieces for a burst

  }, [confettiColor1, confettiColor2, confettiColor3]);


  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <style>{`
        .confetti-fragment {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0;
          animation: confetti-fall var(--duration) ease-out forwards;
        }

        @keyframes confetti-fall {
          0% {
            opacity: 0;
            transform: translateY(0vh) rotateZ(0deg) scale(0.5);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotateZ(720deg) scale(1.2);
          }
        }

        /* Initial burst animation for confetti fragments */
        .confetti-fragment {
            animation-name: confetti-burst-in, confetti-fall;
            animation-duration: 0.5s, var(--duration);
            animation-timing-function: ease-out, ease-out;
            animation-fill-mode: forwards, forwards;
            animation-delay: 0s, var(--delay);
            animation-iteration-count: 1, 1;
            transform-origin: center center;
        }

        @keyframes confetti-burst-in {
            0% { transform: scale(0) rotateZ(0deg); opacity: 0; }
            100% { transform: scale(1) rotateZ(180deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConfettiOverlay;