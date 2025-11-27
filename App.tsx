import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import HomePage from './components/HomePage';
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';
import CheckoutPage from './components/checkout/CheckoutPage';
import AdminPanel from './components/admin/AdminPanel';
import DashboardPage from './components/dashboard/DashboardPage';
import AccountSettingsPage from './components/account/AccountSettingsPage';
import FeedbackModal from './components/feedback/FeedbackModal';
import { type GeneratedContent, type GenerationOptions, type User, type PlanDetails, type SavedListing } from './types';
import { generateListing } from './services/geminiService';
import { login, signup, updateUserName, deleteUser as deleteUserService } from './services/authService';
import { getListings, saveListing, deleteListing, deleteAllUserListings } from './services/savedListingsService';
import { recordGeneration } from './services/usageAnalyticsService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Checkout State
  const [showCheckoutPage, setShowCheckoutPage] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);

  // Admin State
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Page State
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);

  const isAuthenticated = !!currentUser;

  const handleOpenLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
    setAuthError(null);
  };
  const handleOpenSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
    setAuthError(null);
  };
  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setAuthError(null);
    setShowFeedbackModal(false);
  };

  const fetchUserListings = async (user: User) => {
    const listings = await getListings(user.email);
    setSavedListings(listings);
  };

  const handleSuccessfulAuth = (user: User) => {
    setCurrentUser(user);
    fetchUserListings(user);
    handleCloseModals();
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      setAuthError(null);
      const user = await login(email, password);
      handleSuccessfulAuth(user);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const handleSignup = async (email: string, password: string): Promise<void> => {
    try {
        setAuthError(null);
        const user = await signup(email, password);
        handleSuccessfulAuth(user);
    } catch (err) {
        setAuthError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSavedListings([]);
    setShowDashboard(false);
    setShowAccountSettings(false);
  };

  const handleSelectPlan = (plan: PlanDetails) => {
    if (plan.name === 'Free') {
        document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
        if (!isAuthenticated) {
            handleOpenLogin();
            return;
        }
        setSelectedPlan(plan);
        setShowCheckoutPage(true);
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckoutPage(false);
    setSelectedPlan(null);
  };

  const handleToggleAdmin = () => {
      setShowAdminPanel(!showAdminPanel);
  }

  const handleGenerate = useCallback(async (options: GenerationOptions) => {
    if (!isAuthenticated || !currentUser) {
        handleOpenLogin();
        return;
    }
    
    if (currentUser.plan === 'Free' && currentUser.credits <= 0) {
        alert("You have no credits remaining. Please upgrade your plan to continue generating.");
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    setError(null);
    try {
      const content = await generateListing(options);
      setGeneratedContent(content);
      await recordGeneration(currentUser.email); // Track usage
       if (currentUser.plan === 'Free') {
          setCurrentUser(prevUser => prevUser ? { ...prevUser, credits: prevUser.credits - 1 } : null);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate content: ${errorMessage}. Please check your API key and try again.`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  const handleSaveListing = async (content: GeneratedContent, productName: string) => {
    if (!currentUser) return;
    await saveListing(currentUser.email, content, productName);
    await fetchUserListings(currentUser);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!currentUser) return;
    await deleteListing(currentUser.email, listingId);
    await fetchUserListings(currentUser);
  };

  const handleUpdateUserName = async (newName: string) => {
    if (!currentUser) return;
    try {
        const updatedUser = await updateUserName(currentUser.email, newName);
        setCurrentUser(updatedUser);
        // Optionally show a success message
    } catch (error) {
        console.error("Failed to update user name", error);
        // Optionally show an error message
    }
  };

  const handleDeleteAccount = async () => {
      if (!currentUser) return;
      try {
          await deleteUserService(currentUser.email);
          await deleteAllUserListings(currentUser.email);
          handleLogout();
      } catch (error) {
          console.error("Failed to delete account", error);
          // Optionally show an error message
      }
  };
  
  const handleFeedbackSubmit = async (category: string, message: string) => {
    console.log({
      feedback: {
        category,
        message,
        user: currentUser?.email ?? 'Guest',
        timestamp: new Date().toISOString(),
      },
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };
  
  const closeAllPages = () => {
    setShowDashboard(false);
    setShowAccountSettings(false);
  }

  if (showAdminPanel) {
      return <AdminPanel onClose={handleToggleAdmin} />;
  }

  if (showDashboard) {
      return (
          <DashboardPage 
            listings={savedListings} 
            onClose={closeAllPages}
            onDelete={handleDeleteListing}
            user={currentUser!}
          />
      );
  }

  if (showAccountSettings) {
      return (
          <AccountSettingsPage
              user={currentUser!}
              onClose={closeAllPages}
              onUpdateName={handleUpdateUserName}
              onDeleteAccount={handleDeleteAccount}
          />
      );
  }

  return (
    <div className="bg-deep-black text-gray-200 min-h-screen font-sans">
      <Header 
        isAuthenticated={isAuthenticated}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
        onLogoutClick={handleLogout}
        onAdminClick={handleToggleAdmin}
        onDashboardClick={() => { closeAllPages(); setShowDashboard(true); }}
        onAccountSettingsClick={() => { closeAllPages(); setShowAccountSettings(true); }}
        onFeedbackClick={() => setShowFeedbackModal(true)}
        currentUser={currentUser}
      />

      {showLoginModal && (
        <LoginModal 
            onClose={handleCloseModals} 
            onLogin={handleLogin}
            onSwitchToSignup={handleOpenSignup}
            error={authError}
        />
      )}
      {showSignupModal && (
        <SignupModal 
            onClose={handleCloseModals} 
            onSignup={handleSignup}
            onSwitchToLogin={handleOpenLogin}
            error={authError}
        />
      )}
      {showCheckoutPage && selectedPlan && (
        <CheckoutPage 
            plan={selectedPlan} 
            onClose={handleCloseCheckout} 
            userEmail={currentUser?.email}
        />
      )}
      {showFeedbackModal && (
          <FeedbackModal 
              onClose={() => setShowFeedbackModal(false)}
              onSubmit={handleFeedbackSubmit}
          />
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center pt-8 pb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Write Product Descriptions 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-cyan to-royal-blue"> That Sell</span> — Instantly.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
                Generate SEO-optimized titles, descriptions, bullets, and keywords for any e-commerce platform in seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button 
                    onClick={isAuthenticated ? () => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' }) : handleOpenSignup}
                    className="px-6 py-3 bg-gradient-to-r from-royal-blue to-electric-cyan text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                    Start Free
                </button>
            </div>
        </section>
        
        <HomePage onSelectPlan={handleSelectPlan} />

        <section id="generator" className="py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">Try EcomWords AI Now</h2>
                <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
                    {isAuthenticated ? 'Fill out the form below to generate your listing.' : 'Please sign up or log in to use the generator.'}
                </p>
            </div>
           <Generator 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
            content={generatedContent}
            error={error}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onSave={handleSaveListing}
          />
        </section>
        
      </main>
      <footer className="text-center py-6 mt-12 border-t border-brand-gray-light">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} EcomWords AI. Write Less. Sell More.</p>
      </footer>
    </div>
  );
};

export default App;