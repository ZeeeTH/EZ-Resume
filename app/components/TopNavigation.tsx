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

  const handleSignUpClick = () => {
    console.log('Sign up button clicked, user state:', !!user);
    console.log('Opening auth modal...');
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing auth modal...');
    setShowAuthModal(false);
  };

  return (
    <>
      <nav className="w-full bg-transparent absolute top-0 left-0 z-30">
        <div className="flex items-center justify-end w-full px-6 py-4">
          {/* Auth Section */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                <UserMenu onUpgradeClick={onUpgradeClick} />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignUpClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        defaultMode="signup"
      />
    </>
  );
};

export default TopNavigation; 