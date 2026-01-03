import React from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import { useAuth } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const { agent, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-quility-dark-text font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {agent ? <MainPage /> : <LoginPage />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  );
}
