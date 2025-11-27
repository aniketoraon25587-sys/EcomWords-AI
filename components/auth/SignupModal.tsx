import React, { useState } from 'react';
import AuthModal from './AuthModal';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error: string | null;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup, onSwitchToLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSignup(email, password);
    setIsLoading(false);
  };

  return (
    <AuthModal title="Create Account" onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
              required
              placeholder="6+ characters"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-royal-blue text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
              {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-sm text-center text-gray-400">
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToLogin} className="font-medium text-electric-cyan hover:underline">
                  Log In
              </button>
          </p>
        </form>
    </AuthModal>
  );
};

export default SignupModal;