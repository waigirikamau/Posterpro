import React, { useState } from 'react';
import { Palette, User, Crown, LogOut, Settings, CreditCard } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import AuthModal from './AuthModal';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getSubscriptionBadge = () => {
    if (!profile) return null;
    
    const isActive = profile.subscription_status === 'active';
    const plan = profile.subscription_plan;
    
    if (!isActive || plan === 'free') return null;
    
    return (
      <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        <Crown className="h-4 w-4" />
        <span>{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
      </div>
    );
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PosterPro
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#templates" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Templates</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">How it Works</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {getSubscriptionBadge()}
                  
                  {profile && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{profile.credits_remaining}</span> credits
                    </div>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden md:inline font-medium">
                        {profile?.full_name || user.email}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Billing</span>
                        </button>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Get Started</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">Sign In</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;