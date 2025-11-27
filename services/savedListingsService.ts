import { type GeneratedContent, type SavedListing } from '../types';

const getStorageKey = (userEmail: string): string => `ecomwords_listings_${userEmail}`;

export const getListings = (userEmail: string): Promise<SavedListing[]> => {
  return new Promise((resolve) => {
    const key = getStorageKey(userEmail);
    const data = localStorage.getItem(key);
    resolve(data ? JSON.parse(data) : []);
  });
};

export const saveListing = (userEmail: string, content: GeneratedContent, productName: string): Promise<SavedListing> => {
  return new Promise(async (resolve) => {
    const key = getStorageKey(userEmail);
    const existingListings = await getListings(userEmail);

    const newListing: SavedListing = {
      ...content,
      id: new Date().getTime().toString(),
      savedAt: new Date().toISOString(),
      productName: productName,
    };

    const updatedListings = [newListing, ...existingListings];
    localStorage.setItem(key, JSON.stringify(updatedListings));
    resolve(newListing);
  });
};

export const deleteListing = (userEmail: string, listingId: string): Promise<void> => {
  return new Promise(async (resolve) => {
    const key = getStorageKey(userEmail);
    const existingListings = await getListings(userEmail);

    const updatedListings = existingListings.filter(l => l.id !== listingId);
    localStorage.setItem(key, JSON.stringify(updatedListings));
    resolve();
  });
};

export const deleteAllUserListings = (userEmail: string): Promise<void> => {
  return new Promise((resolve) => {
    const key = getStorageKey(userEmail);
    localStorage.removeItem(key);
    resolve();
  });
};