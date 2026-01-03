// Mock Phone Context
import React, { createContext, useContext } from 'react';
const PhoneContext = createContext<any>(null);
export const PhoneProvider = ({ children }: { children: any }) => <PhoneContext.Provider value={{}}>{children}</PhoneContext.Provider>;
export const usePhone = () => ({
    simulateIncomingCall: () => {},
    connection: null,
});
