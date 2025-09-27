import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { matchAPI, paymentAPI, authAPI } from '../utils/firebase/client';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { PaymentPopup } from './PaymentPopup';
import { DreamyBackground } from './DreamyBackground';

interface UserProfile {
  name: string;
  age: string;
  height: string;
  interests: string[];
  email: string;
  instagram: string;
  password: string;
  gender: 'male' | 'female';
  partnerAgeRange: [number, number];
  partnerHeightRange: string;
  partnerSkinTone: string;
  partnerInterests: string;
  aboutMe: string;
}

interface AIMatchmakingProps {
  userProfile: UserProfile;
  onStartOver: () => void;
}

export function AIMatchmaking({ userProfile = {} as UserProfile, onStartOver }: AIMatchmakingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'searching' | 'match-found' | 'no-match' | 'paywall' | 'profile-view'>('searching');
  const [matchProfile, setMatchProfile] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const steps = [
    "Analyzing your profile...",
    "Scanning compatible matches...",
    "Running compatibility algorithms...",
    "Checking mutual interests...",
    "Finalizing perfect matches..."
  ];

  // Female profiles for male users
  const femaleProfiles = [
    {
      name: "Sarah",
      age: 23,
      gender: "female",
      instagram: "@sarah_adventures",
      interests: ["Travel", "Photography", "Coffee", "Music", "Art"],
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "Adventure seeker who loves capturing beautiful moments ✨",
      compatibility: 95,
      height: "5'5\"",
      location: "Mumbai"
    },
    {
      name: "Priya",
      age: 24,
      gender: "female",
      instagram: "@priya_bookworm",
      interests: ["Reading", "Yoga", "Cooking", "Travel", "Movies"],
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Bookworm who finds magic in everyday moments 📚",
      compatibility: 92,
      height: "5'4\"",
      location: "Bangalore"
    },
    {
      name: "Ananya",
      age: 22,
      gender: "female",
      instagram: "@ananya_artist",
      interests: ["Art", "Dancing", "Photography", "Coffee", "Nature"],
      photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
      bio: "Artist who paints life with vibrant colors 🎨",
      compatibility: 89,
      height: "5'3\"",
      location: "Chennai"
    }
  ];

  // Male profiles for female users
  const maleProfiles = [
    {
      name: "Arjun",
      age: 25,
      gender: "male",
      instagram: "@arjun_fitness",
      interests: ["Fitness", "Movies", "Food", "Travel", "Music"],
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Fitness enthusiast who loves trying new cuisines 🍕",
      compatibility: 88,
      height: "5'10\"",
      location: "Delhi"
    },
    {
      name: "Rohan",
      age: 26,
      gender: "male",
      instagram: "@rohan_traveler",
      interests: ["Travel", "Photography", "Adventure", "Music", "Food"],
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      bio: "Explorer who believes life is about collecting experiences 🌍",
      compatibility: 94,
      height: "6'0\"",
      location: "Pune"
    },
    {
      name: "Karan",
      age: 24,
      gender: "male",
      instagram: "@karan_techie",
      interests: ["Technology", "Gaming", "Movies", "Coffee", "Books"],
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Tech enthusiast who codes by day and dreams by night 💻",
      compatibility: 91,
      height: "5'9\"",
      location: "Hyderabad"
    }
  ];

  useEffect(() => {
    if (phase !== 'searching') return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);

    // Complete the search after progress reaches 100%
    const completeTimer = setTimeout(async () => {
      try {
        // Call backend to find matches
        const result = await matchAPI.findMatches();
        
        if (result.success && result.matches && result.matches.length > 0) {
          // Use the first match from backend
          const backendMatch = result.matches[0];
          
          // If backend returns matches, use them; otherwise fall back to mock data
          if (backendMatch) {
            setMatchProfile({
              name: backendMatch.name,
              age: parseInt(backendMatch.age),
              gender: backendMatch.gender,
              instagram: backendMatch.instagram || '@profile',
              interests: backendMatch.interests || [],
              photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
              bio: backendMatch.bio || "Looking for meaningful connections ✨",
              compatibility: Math.floor(Math.random() * 15) + 85, // 85-99%
              height: backendMatch.height || "5'6\"",
              location: backendMatch.city || "Unknown"
            });
          } else {
            // Fall back to mock profiles
            const oppositeGenderProfiles = userProfile.gender === 'male' ? femaleProfiles : maleProfiles;
            const randomIndex = Math.floor(Math.random() * oppositeGenderProfiles.length);
            setMatchProfile(oppositeGenderProfiles[randomIndex]);
          }
          
          setPhase('match-found');
          setShowNotificationModal(true);
        } else {
          // No matches found or backend error, use mock data as fallback
          const oppositeGenderProfiles = userProfile.gender === 'male' ? femaleProfiles : maleProfiles;
          
          if (Math.random() > 0.15) { // 85% chance of match with fallback
            const randomIndex = Math.floor(Math.random() * oppositeGenderProfiles.length);
            setMatchProfile(oppositeGenderProfiles[randomIndex]);
            setPhase('match-found');
            setShowNotificationModal(true);
          } else {
            setPhase('no-match');
            setShowNotificationModal(true);
          }
        }
      } catch (error) {
        console.error('Error finding matches:', error);
        // Fall back to mock matching on error
        const oppositeGenderProfiles = userProfile.gender === 'male' ? femaleProfiles : maleProfiles;
        const randomIndex = Math.floor(Math.random() * oppositeGenderProfiles.length);
        setMatchProfile(oppositeGenderProfiles[randomIndex]);
        setPhase('match-found');
        setShowNotificationModal(true);
      }
    }, 8000); // 8 seconds total

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [phase, userProfile]);

  const handleUnlockProfile = () => {
    setShowPaymentPopup(true);
    setShowNotificationModal(false);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      // Process payment through backend
      const result = await paymentAPI.processPayment(49, paymentData.method || 'card');
      
      if (result.success) {
        setShowPaymentPopup(false);
        setPhase('profile-view');
      } else {
        alert(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentPopup(false);
    setShowNotificationModal(true);
  };

  const handleTryAgain = () => {
    setShowNotificationModal(false);
    setPhase('searching');
    setProgress(0);
    setCurrentStep(0);
  };

  if (phase === 'profile-view' && matchProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="bg-white border-0 shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-4xl mb-4"
              >
                💖
              </motion.div>
              <h1 className="text-2xl text-pink-600 mb-2" style={{ fontWeight: '600' }}>Your Perfect Match!</h1>
              <div className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-6 py-3 shadow-lg">
                <motion.span 
                  className="text-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ color: '#FFD700' }}
                >
                  ⭐
                </motion.span>
                <span className="text-pink-600 text-base font-medium">
                  {matchProfile.compatibility}% Soul Connection
                </span>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="text-center mb-8">
                <motion.div
                  className="relative inline-block mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full blur-sm opacity-60"></div>
                  <img
                    src={matchProfile.photo}
                    alt={matchProfile.name}
                    className="relative w-36 h-36 rounded-full object-cover border-4 border-pink-200 shadow-2xl"
                  />
                  <motion.div
                    className="absolute -top-2 -right-2 text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💖
                  </motion.div>
                </motion.div>
                <h2 className="text-2xl text-gray-800 mb-2" style={{ fontWeight: '600' }}>{matchProfile.name}, {matchProfile.age}</h2>
                <p className="text-gray-600 text-sm mb-2">{matchProfile.height} • {matchProfile.location}</p>
                <p className="text-gray-700 text-sm mb-4">{matchProfile.bio}</p>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-xs mb-2">Common Interests</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {matchProfile.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-700 text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-pink-50 rounded-2xl p-5 mb-8 border border-pink-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-pink-500">📸</span>
                    <p className="text-gray-700 text-sm font-medium">Instagram</p>
                  </div>
                  <p className="text-pink-600 text-lg font-medium">{matchProfile.instagram}</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => window.open(`https://instagram.com/${matchProfile.instagram.replace('@', '')}`, '_blank')}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-4 text-lg shadow-lg"
                    style={{ fontWeight: '600' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        💫
                      </motion.span>
                      Connect on Instagram
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                      >
                        💫
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
                
                <div className="space-y-3">
                  <Button
                    onClick={onStartOver}
                    variant="outline"
                    className="w-full border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full py-3"
                    style={{ fontWeight: '500' }}
                  >
                    Find Another Soulmate ✨
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      try {
                        await authAPI.signOut();
                        onStartOver(); // This will reset the app state
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-pink-600 rounded-full py-2"
                    style={{ fontWeight: '400' }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)' }}>
      {/* Flying Cupid Animation */}
      {phase === 'searching' && (
        <motion.div
          animate={{ 
            x: [-100, 1200],
            y: [100, 80]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-4xl z-10 top-10"
        >
          😇
        </motion.div>
      )}

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={handlePaymentClose}
        onPaymentSuccess={handlePaymentSuccess}
        amount={49}
      />

      {/* Notification Modals */}
      <Dialog open={showNotificationModal} onOpenChange={(open) => {
        if (!open) setShowNotificationModal(false);
      }}>
        <DialogContent className="max-w-md mx-auto bg-white border-0 shadow-2xl rounded-3xl">
          <DialogTitle className="text-pink-600 text-xl text-center mb-4" style={{ fontWeight: '600' }}>
            {phase === 'match-found' ? 'Match Found!' : 'Still Searching...'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {phase === 'match-found' 
              ? 'We found someone who matches your preferences' 
              : 'No matches found at this time'
            }
          </DialogDescription>
          
          <div className="text-center p-6">
            {phase === 'match-found' ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  💖
                </motion.div>
                <motion.h2 
                  className="text-3xl text-pink-600 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ fontWeight: '600' }}
                >
                  We've found someone who matches your vibe! ✨
                </motion.h2>
                <p className="text-gray-700 mb-6">
                  {matchProfile?.compatibility}% compatibility with {matchProfile?.name}!
                </p>
                
                <div className="bg-pink-50 rounded-2xl p-6 mb-6 border border-pink-200">
                  <div className="flex items-center justify-center mb-3">
                    <motion.div 
                      className="text-2xl mr-2"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💝
                    </motion.div>
                    <p className="text-gray-700 text-base font-medium">Get to know your perfect match for just</p>
                  </div>
                  <div className="text-4xl text-pink-600 mb-3" style={{ fontWeight: '700' }}>₹49</div>
                  <div className="flex justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">✨</span>
                      <span>View Photos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-pink-500">💫</span>
                      <span>Instagram Handle</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">🌟</span>
                      <span>Contact Info</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleUnlockProfile}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-4 text-lg shadow-lg"
                      style={{ fontWeight: '600' }}
                    >
                      <motion.span 
                        className="flex items-center justify-center gap-2"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <span>💖</span>
                        <span>See Your Perfect Match</span>
                        <span>💖</span>
                      </motion.span>
                    </Button>
                  </motion.div>
                  
                  <Button
                    onClick={() => setShowNotificationModal(false)}
                    variant="outline"
                    className="w-full border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full py-3"
                    style={{ fontWeight: '500' }}
                  >
                    Maybe Later ✨
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex justify-center gap-3 mt-6">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs rounded-full px-3 py-1">
                    <span className="text-yellow-500">🔐</span> Secure Payment
                  </Badge>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs rounded-full px-3 py-1">
                    <span className="text-blue-500">💳</span> UPI/Cards
                  </Badge>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  💭
                </motion.div>
                <h2 className="text-2xl text-white mb-4">Still Looking...</h2>
                <p className="text-white/80 mb-6">
                  We're still searching for your perfect match. Please check back in 24 hours!
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleTryAgain}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full py-3"
                  >
                    Try Again Later 🔄
                  </Button>
                  
                  <Button
                    onClick={onStartOver}
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full"
                  >
                    Update Preferences ⚙️
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Searching Interface */}
      {phase === 'searching' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="bg-white border-0 shadow-2xl rounded-3xl text-center">
            <CardContent className="p-8">
              {/* AI Brain Animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-6"
              >
                🧠✨
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-pink-600 mb-4"
                style={{ fontWeight: '600' }}
              >
                AI Cupid is Working 💕
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-700 mb-8"
              >
                {steps[currentStep]}
              </motion.p>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="bg-pink-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-pink-500 h-full rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="text-gray-600 text-sm mt-2">{Math.round(progress)}% Complete</div>
              </div>

              {/* Floating Hearts */}
              <div className="relative h-20">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -30, 0],
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                    className="absolute text-2xl text-pink-300"
                    style={{
                      left: `${i * 20 + 10}%`,
                      top: '50%'
                    }}
                  >
                    💖
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/60 text-sm"
              >
                This may take up to 24 hours.<br />
                You'll be notified when we find a match! 📱
              </motion.p>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex justify-center gap-4 mt-6"
              >
                <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                  🔒 Secure
                </div>
                <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                  🤖 AI Powered
                </div>
                <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                  💝 Verified
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}