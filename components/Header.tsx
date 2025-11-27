import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';
import { MessageIcon } from './icons/MessageIcon';
import { type User } from '../types';

interface HeaderProps {
    isAuthenticated: boolean;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogoutClick: () => void;
    onAdminClick?: () => void;
    onDashboardClick: () => void;
    onAccountSettingsClick: () => void;
    onFeedbackClick: () => void;
    currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ 
    isAuthenticated, 
    onLoginClick, 
    onSignupClick, 
    onLogoutClick, 
    onAdminClick, 
    onDashboardClick, 
    onAccountSettingsClick, 
    onFeedbackClick,
    currentUser 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountSettingsClick = () => {
    onAccountSettingsClick();
    setIsDropdownOpen(false);
  };

  const handleDashboardClick = () => {
    onDashboardClick();
    setIsDropdownOpen(false);
  }

  const handleLogoutClick = () => {
    onLogoutClick();
    setIsDropdownOpen(false);
  }

  return (
    <header className="bg-deep-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-brand-gray-light">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-royal-blue to-electric-cyan p-2 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EcomWords AI</span>
        </a>
        <div className="flex items-center space-x-6 text-gray-300">
            <a onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer hidden md:inline-block hover:text-white transition-colors">Features</a>
            <a onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer hidden md:inline-block hover:text-white transition-colors">Pricing</a>
            
            <button onClick={onFeedbackClick} className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <MessageIcon className="w-5 h-5" />
              <span>Feedback</span>
            </button>
            
            <button onClick={onAdminClick} className="hidden lg:inline-block text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 text-gray-400">
                Admin
            </button>

            {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-brand-gray-light transition-colors">
                        {currentUser?.picture ? (
                            <img src={currentUser.picture} alt="User" className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-gray-medium flex items-center justify-center">
                                <UserIcon className="w-5 h-5" />
                            </div>
                        )}
                        <span className="hidden md:inline font-medium text-white pr-2">{currentUser?.name}</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-brand-gray-medium border border-brand-gray-light rounded-lg shadow-lg py-1 animate-fade-in-fast">
                            <button onClick={handleDashboardClick} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-gray-light hover:text-white transition-colors">
                                Dashboard
                            </button>
                            <button onClick={handleAccountSettingsClick} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-gray-light hover:text-white transition-colors">
                                Account Settings
                            </button>
                            <div className="border-t border-brand-gray-light my-1"></div>
                            <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <button onClick={onLoginClick} className="hidden md:inline-block hover:text-white transition-colors">Login</button>
                    <button onClick={onSignupClick} className="px-4 py-2 bg-royal-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Sign Up
                    </button>
                </>
            )}
        </div>
      </nav>
    </header>
  );
};

export default Header;