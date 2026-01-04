import React, { useState } from 'react';
import FunnelLogo from './icons/FunnelLogo';
import { useAuth } from '../context/AuthContext';
import Button from './q_design/Button';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, error, setError } = useAuth();

  const handleLogin = () => {
    signIn(username, password);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className="min-h-screen font-mont bg-quility text-quility-dark-text flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto bg-quility-block-bg border border-quility-border rounded-lg shadow-lg p-8 md:p-12 text-center mt-[-10vh]">
          <div className="mb-8">
            <div className="inline-block w-3/5">
                <FunnelLogo />
            </div>
          </div>

          <div className="h-6 mb-4">
            {error && (
                <div className="text-red-500 font-semibold text-base">{error}</div>
            )}
          </div>

          <div className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full h-11 px-3 text-base border border-quility-border rounded-md bg-quility-input-bg focus:outline-none focus:ring-2 focus:ring-quility/50 text-quility-dark-grey placeholder:text-quility-dark-grey"
                placeholder="User Name"
                value={username}
                onFocus={() => setError('')}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full h-11 px-3 text-base border border-quility-border rounded-md bg-quility-input-bg focus:outline-none focus:ring-2 focus:ring-quility/50 text-quility-dark-grey placeholder:text-quility-dark-grey"
                value={password}
                onFocus={() => setError('')}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          <div className="text-center mt-4 flex justify-center space-x-4">
            <span className="text-sm text-quility-dark-text cursor-default">
              (Use any credentials to login)
            </span>
          </div>

          <div className="mt-8">
              <Button
                type="submit"
                //className="w-full sm:w-52 h-11 text-lg bg-quility-button text-quility-light-text font-bold rounded-md hover:bg-quility-button-hover transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quility"
                onClick={handleLogin}
                hierarchy='primary'
            >

              Sign In
         </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
