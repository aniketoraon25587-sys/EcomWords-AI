import React, { useEffect, useState } from 'react';
import { type SavedListing, type User } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { TrashIcon } from '../icons/TrashIcon';
import UsageAnalyticsGraph from './UsageAnalyticsGraph';
import { getWeeklyUsage } from '../../services/usageAnalyticsService';

interface DashboardPageProps {
  listings: SavedListing[];
  onClose: () => void;
  onDelete: (listingId: string) => void;
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ listings, onClose, onDelete, user }) => {
  const [usageData, setUsageData] = useState<number[]>([]);

  useEffect(() => {
    const fetchUsage = async () => {
      if (user?.email) {
        const data = await getWeeklyUsage(user.email);
        setUsageData(data);
      }
    };
    fetchUsage();
  }, [user.email]);

  return (
    <div className="bg-deep-black text-gray-200 min-h-screen font-sans">
      <header className="bg-brand-gray-dark sticky top-0 z-50 border-b border-brand-gray-light">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 bg-brand-gray-medium rounded-lg hover:bg-brand-gray-light transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">My Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden sm:inline">{user.name}</span>
              {user.picture && <img src={user.picture} alt="User" className="w-9 h-9 rounded-full" />}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        
        <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">Usage Analytics</h2>
            <UsageAnalyticsGraph data={usageData} />
        </div>

        <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white">Saved Listings</h2>
            <p className="text-gray-400 mt-1">Here are all the product listings you've saved. You have {listings.length} saved items.</p>
        </div>
        
        {listings.length === 0 ? (
          <div className="text-center py-20 bg-brand-gray-medium rounded-xl border border-brand-gray-light">
            <SparklesIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white">No Saved Listings Yet</h3>
            <p className="text-gray-400">Go to the generator to create and save your first listing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <SavedListingCard key={listing.id} listing={listing} onDelete={onDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const SavedListingCard: React.FC<{ listing: SavedListing, onDelete: (id: string) => void }> = ({ listing, onDelete }) => {
    
    const handleDelete = () => {
        if(window.confirm(`Are you sure you want to delete the listing for "${listing.productName}"?`)) {
            onDelete(listing.id);
        }
    }
    
    return (
        <div className="bg-brand-gray-medium p-5 rounded-xl border border-brand-gray-light flex flex-col group transition-all hover:border-royal-blue">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg text-white truncate">{listing.productName}</h3>
                    <p className="text-xs text-gray-500">Saved on {new Date(listing.savedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300 overflow-hidden flex-grow">
               <div>
                   <h4 className="font-semibold text-gray-400 mb-1">Title Example</h4>
                   <p className="bg-brand-gray-dark p-2 rounded truncate">"{listing.titles[0]}"</p>
               </div>
                <div>
                   <h4 className="font-semibold text-gray-400 mb-1">Description Snippet</h4>
                   <p className="bg-brand-gray-dark p-2 rounded text-xs line-clamp-3">{listing.description}</p>
               </div>
            </div>
        </div>
    );
}

export default DashboardPage;