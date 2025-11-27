import React, { useState } from 'react';
import { type User } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UserIcon } from '../icons/UserIcon';

interface AccountSettingsPageProps {
  user: User;
  onClose: () => void;
  onUpdateName: (newName: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ user, onClose, onUpdateName, onDeleteAccount }) => {
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateName(name);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible and will delete all your saved listings.")) {
      onDeleteAccount();
    }
  };

  const handleManageSubscription = () => {
    onClose();
    // Use a timeout to ensure the main page is rendered before scrolling
    setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-deep-black text-gray-200 min-h-screen font-sans">
      <header className="bg-brand-gray-dark sticky top-0 z-50 border-b border-brand-gray-light">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 bg-brand-gray-medium rounded-lg hover:bg-brand-gray-light transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Account Settings</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-12">
          
          {/* Profile Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
            <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light">
              <div className="flex items-center gap-6 mb-6">
                {user.picture ? (
                  <img src={user.picture} alt="User" className="w-20 h-20 rounded-full" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-gray-dark flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              <form onSubmit={handleNameUpdate}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <div className="flex gap-2">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
                  />
                  <button type="submit" disabled={isSaving || name === user.name} className="px-5 py-2 bg-royal-blue text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Subscription Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Subscription</h2>
            <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light flex justify-between items-center">
              <div>
                <p className="text-gray-400">Your current plan</p>
                <p className="text-xl font-bold text-white">{user.plan} Plan</p>
              </div>
              <button 
                onClick={handleManageSubscription}
                className="px-5 py-2 border border-brand-gray-light bg-brand-gray-dark text-white rounded-lg font-bold hover:bg-brand-gray-light transition-colors">
                Manage Subscription
              </button>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Danger Zone</h2>
            <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">Delete Account</h3>
                <p className="text-sm text-red-300/80">Permanently delete your account and all your data. This action cannot be undone.</p>
              </div>
              <button onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AccountSettingsPage;