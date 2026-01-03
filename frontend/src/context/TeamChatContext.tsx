// Mock TeamChat Context
import React, { createContext, useContext } from 'react';
const TeamChatContext = createContext<any>(null);
export const TeamChatProvider = ({ children }: { children: any }) => <TeamChatContext.Provider value={{}}>{children}</TeamChatContext.Provider>;
export const useTeamChat = () => ({});
