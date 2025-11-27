import React, { useState } from 'react';
import AuthModal from './AuthModal';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  error: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onSwitchToSignup, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <AuthModal title="Log In" onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-royal-blue text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          
          <p className="text-sm text-center text-gray-400">
              Don't have an account?{' '}
              <button type="button" onClick={onSwitchToSignup} className="font-medium text-electric-cyan hover:underline">
                  Sign Up
              </button>
          </p>
        </form>
    </AuthModal>
  );
};

export default LoginModal;