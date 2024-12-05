import React, { createContext, useState, useContext, ReactNode } from 'react';

const AppContext = createContext<any | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [sharedData, setSharedData] = useState<any>(null);
  return <AppContext.Provider value={{ sharedData, setSharedData }}>{children}</AppContext.Provider>;
}

export function useAppContext(): any {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
