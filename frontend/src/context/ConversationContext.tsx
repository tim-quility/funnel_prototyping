// Mock Conversation Context
import React, { createContext, useContext } from 'react';
const ConversationContext = createContext<any>(null);
export const ConversationProvider = ({ children }: { children: any }) => <ConversationContext.Provider value={{}}>{children}</ConversationContext.Provider>;
export const useConversation = () => ({
    setIsOpen: () => {},
    unreadCount: 0,
});
