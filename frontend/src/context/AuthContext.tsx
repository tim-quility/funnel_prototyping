import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AgentInfo } from '../types';

interface AuthContextType {
  agent: AgentInfo | null;
  loading: boolean;
  signIn: (username?: string, password?: string) => Promise<void>;
  signOut: () => void;
  error: string;
  setError: (error: string) => void;
  isLiveTransferActive: boolean;
  toggleLiveTransferStatus: () => void;
  optInToLiveTransfers: () => void;
  activateRecruitingModule: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_AGENT: AgentInfo = {
    id: 1,
    username: 'test',
    firstName: 'Demo',
    lastName: 'Agent',
    email: 'demo@example.com',
    role: 'agent',
    created_at: new Date().toISOString(),
    organizationId: 'master',
    liveTransferOptIn: false,
    a2pOnly: false,
    permissions: {
        text: 1,
        email: 1,
        script: 1,
        objection: 1
    }
};

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLiveTransferActive, setIsLiveTransferActive] = useState(false);

  const signIn = async (username?: string, password?: string) => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
        setAgent(MOCK_AGENT);
        setLoading(false);
    }, 500);
  };

  const signOut = () => {
    setAgent(null);
  };

  const toggleLiveTransferStatus = () => setIsLiveTransferActive(!isLiveTransferActive);
  const optInToLiveTransfers = () => {};
  const activateRecruitingModule = () => {};

  return (
    <AuthContext.Provider value={{
        agent,
        loading,
        signIn,
        signOut,
        error,
        setError,
        isLiveTransferActive,
        toggleLiveTransferStatus,
        optInToLiveTransfers,
        activateRecruitingModule,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
