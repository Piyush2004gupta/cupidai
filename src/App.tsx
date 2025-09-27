import { useState, memo, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { authAPI, onAuthStateChange } from './utils/firebase/client';

// Import components directly for better performance
import { LandingPage } from './components/LandingPage';
import { GenderSelectionModal } from './components/GenderSelectionModal';
import { SimpleSignUpForm } from './components/SimpleSignUpForm';
import { OTPVerification } from './components/OTPVerification';
import { PartnerPreferences } from './components/PartnerPreferences';
import { AIMatchmaking } from './components/AIMatchmaking';
import { SignInForm } from './components/SignInForm';

type AppState = 'landing' | 'signup' | 'otp-verification' | 'preferences' | 'ai-search' | 'signin';

interface UserProfile {
  name: string;
  age: string;
  height: string;
  interests: string[];
  email: string;
  mobile: string;
  city: string;
  skinTone: string;
  instagram: string;
  password: string;
  gender: 'male' | 'female';
  partnerAgeRange: [number, number];
  partnerHeightRange: string;
  partnerSkinTone: string;
  partnerInterests: string;
  lookingFor: string;
}

// Simplified Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center p-4" 
       style={{ background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)' }}>
    <div className="text-center text-white">
      <div className="text-4xl mb-4">💖</div>
      <h1 className="text-xl">Loading...</h1>
    </div>
  </div>
);

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication state on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authAPI || typeof authAPI.getCurrentSession !== 'function') {
          console.warn('Auth API not properly initialized');
          setIsAuthenticated(false);
          setCurrentState('landing');
          setIsLoading(false);
          return;
        }

        const result = await authAPI.getCurrentSession();
        
        if (result && result.success && result.session) {
          setSession(result.session);
          setIsAuthenticated(true);
          // If user is logged in, redirect to preferences or AI search based on profile completion
          setCurrentState('preferences');
        } else {
          setIsAuthenticated(false);
          setCurrentState('landing');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On timeout or error, continue to landing page
        setIsAuthenticated(false);
        setCurrentState('landing');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    let unsubscribe: (() => void) | null = null;
    
    try {
      if (typeof onAuthStateChange === 'function') {
        const { data } = onAuthStateChange((user) => {
          setSession(user);
          setIsAuthenticated(!!user);
          
          if (!user) {
            // User signed out, reset state
            setCurrentState('landing');
            setUserProfile({});
            setSelectedGender(null);
            setShowGenderModal(false);
          } else {
            // User signed in, check if they need to complete their profile
            setCurrentState('preferences');
          }
        });

        unsubscribe = data?.subscription?.unsubscribe || null;
      } else {
        console.warn('onAuthStateChange is not a function');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth listener setup failed:', error);
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth state:', error);
        }
      }
    };
  }, []);

  const handleFindMatch = useCallback(() => {
    setShowGenderModal(true);
  }, []);

  const handleGenderSelect = useCallback((gender: 'male' | 'female') => {
    try {
      setSelectedGender(gender);
      setUserProfile(prev => ({ ...prev, gender }));
      setShowGenderModal(false);
      setCurrentState('signup');
    } catch (error) {
      console.error('Error selecting gender:', error);
      setShowGenderModal(false);
    }
  }, []);

  const handleSignUpComplete = (formData: Partial<UserProfile>) => {
    try {
      setUserProfile(prev => ({ ...prev, ...formData }));
      setCurrentState('otp-verification');
    } catch (error) {
      console.error('Error completing signup:', error);
    }
  };

  const handleOTPVerified = () => {
    setCurrentState('preferences');
  };

  const handlePreferencesComplete = (preferencesData: Partial<UserProfile>) => {
    try {
      setUserProfile(prev => ({ ...prev, ...preferencesData }));
      setCurrentState('ai-search');
    } catch (error) {
      console.error('Error completing preferences:', error);
    }
  };

  const handleSignIn = () => {
    setCurrentState('signin');
  };

  const handleSignUp = () => {
    setCurrentState('signup');
  };

  const handleStartOver = () => {
    setCurrentState('landing');
    setSelectedGender(null);
    setUserProfile({});
    setShowGenderModal(false);
  };

  const handleBackToSignUp = () => {
    setCurrentState('signup');
  };

  const handleBackToOTP = () => {
    setCurrentState('otp-verification');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    setShowGenderModal(false);
  };

  // Optimized render function
  const renderCurrentState = () => {
    switch (currentState) {
      case 'landing':
        return (
          <>
            <LandingPage onFindMatch={handleFindMatch} />
            <GenderSelectionModal
              isOpen={showGenderModal}
              onClose={() => setShowGenderModal(false)}
              onSelect={handleGenderSelect}
            />
          </>
        );

      case 'signin':
        return <SignInForm onSignUp={handleSignUp} onSignInSuccess={() => setCurrentState('preferences')} />;

      case 'signup':
        if (!selectedGender) {
          setCurrentState('landing');
          return <LoadingSpinner />;
        }
        return (
          <SimpleSignUpForm 
            selectedGender={selectedGender}
            onComplete={handleSignUpComplete}
            onSignIn={handleSignIn}
            onBack={handleBackToLanding}
          />
        );

      case 'otp-verification':
        return (
          <OTPVerification 
            mobile={userProfile.mobile || ''}
            onVerified={handleOTPVerified}
            onBack={handleBackToSignUp}
          />
        );

      case 'preferences':
        return (
          <PartnerPreferences 
            userProfile={userProfile}
            onComplete={handlePreferencesComplete}
            onBack={handleBackToOTP}
          />
        );

      case 'ai-search':
        return (
          <AIMatchmaking 
            userProfile={userProfile as UserProfile}
            onStartOver={handleStartOver}
          />
        );

      default:
        return <LandingPage onFindMatch={handleFindMatch} />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-container">
      <div style={{ minHeight: '100vh' }}>
        {renderCurrentState()}
      </div>
    </div>
  );
}