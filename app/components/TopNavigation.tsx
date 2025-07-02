import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

interface TopNavigationProps {
  onUpgradeClick?: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onUpgradeClick }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getFirstName = () => {
    if (!user?.email) return '';
    
    // Try to get name from email (before @)
    const emailName = user.email.split('@')[0];
    
    // Capitalize first letter and handle common name patterns
    return emailName
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  return (
    <>
      <nav className="w-full bg-transparent relative z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            {/* Auth Section */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm hidden sm:block">
                    Hi {getFirstName()}
                  </span>
                  <UserMenu onUpgradeClick={onUpgradeClick} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
};

export default TopNavigation; 