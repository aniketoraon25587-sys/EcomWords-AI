
import React from 'react';
import { XIcon } from '../icons/XIcon';

interface AuthModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const AuthModal: React.FC<AuthModalProps> = ({ title, onClose, children }) => {
  return (
    <div 
        className="fixed inset-0 bg-deep-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative bg-brand-gray-medium border border-brand-gray-light rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
