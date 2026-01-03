import React, { useState } from 'react';
import FunnelLogo from './icons/FunnelLogo';
import { useAuth } from '../context/AuthContext';
import Icon from './common/Icon';
import AgentInfo from './header/AgentInfo';

interface HeaderBarProps {
  fetchPage: (page: string) => void;
  setShowVoicemailsPage: (show: boolean) => void;
  unheardCount: number;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ fetchPage }) => {
  const { agent } = useAuth();

  if (!agent) return null;

  return (
    <>
      <header id="barWrapper" className="h-[50px] bg-quility-accent-bg flex fixed w-full z-30 border-b border-quility-border items-center px-4">
        <div className="relative">
             <div className="p-2 w-[40px]"></div>
        </div>

        <div className="flex-grow text-center">
          <div className="inline-block h-8">
            <FunnelLogo className="h-full w-auto" />
          </div>
        </div>

        <div className="flex items-center gap-4">
             {/* Spacer to balance layout if needed */}
        </div>

        <div className="w-[200px] flex justify-end">
          <AgentInfo fetchNewPage={fetchPage} />
        </div>
      </header>
    </>
  );
};

export default HeaderBar;
