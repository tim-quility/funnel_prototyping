
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';

interface AgentInfoProps {
  fetchNewPage: (page: string) => void;
}

const AgentInfo: React.FC<AgentInfoProps> = ({ fetchNewPage }) => {
  const { agent, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  if (!agent) return null;

  const agentName = `${agent.firstName} ${agent.lastName}`;

  const MenuItem: React.FC<{ label: string; onClick: () => void; destructive?: boolean }> = ({ label, onClick, destructive }) => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`block px-4 py-2.5 text-sm rounded-md transition-colors ${
        destructive
        ? 'text-quility-destructive hover:bg-red-50'
        : 'text-quility-dark-text hover:bg-quility-hover-grey'
      }`}
    >
      <span>{label}</span>
    </a>
  );


  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/5 transition-colors w-full text-left"
      >
        <Avatar name={agentName} size={32} />
        <div className="overflow-hidden hidden xl:block">
          <p className="text-sm font-semibold truncate text-quility-dark-text">{agentName}</p>
        </div>
        {/* FIX: Property 'style' does not exist on type 'IntrinsicAttributes & IconProps'. Replaced with className. */}
        <Icon name="chevron-down" size={16} className={`ml-auto text-quility-dark-grey hidden xl:block transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-quility-border z-10 origin-top-right animate-scale-in"
        >
          <div className="p-2">
            <div className="px-2 py-3 border-b border-quility-border mb-2">
                <p className="font-bold text-quility-dark-text truncate">{agentName}</p>
                <p className="text-xs text-quility-dark-grey truncate">{agent.email}</p>
            </div>

            <MenuItem label="Profile" onClick={() => { fetchNewPage('Profile'); setIsOpen(false); }} />
            <MenuItem label="Settings" onClick={() => { fetchNewPage('Settings'); setIsOpen(false); }} />
            <MenuItem label="Subscription" onClick={() => { fetchNewPage('Subscription'); setIsOpen(false); }} />

            <div className="border-t border-quility-border my-2"></div>

            <MenuItem label="Sign Out" onClick={signOut} destructive />
          </div>
        </div>
      )}
       <style>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-scale-in {
            animation: scale-in 0.1s ease-out;
          }
        `}</style>
    </div>
  );
};

export default AgentInfo;