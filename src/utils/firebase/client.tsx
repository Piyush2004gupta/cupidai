import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db } from './config';

// Check if Firebase is properly initialized
const checkFirebaseAuth = () => {
  if (!auth) {
    console.warn('Firebase Auth is not properly initialized. Running in demo mode.');
    return null;
  }
  return auth;
};

// Demo mode handlers for when Firebase is not configured
const demoAuthHandlers = {
  async signUp(userData: any) {
    console.log('Demo mode: Sign up attempted with:', userData.email);
    return { 
      success: true, 
      user: { 
        id: 'demo-user-' + Date.now(), 
        email: userData.email, 
        name: userData.name 
      } 
    };
  },
  
  async signIn(email: string, password: string) {
    console.log('Demo mode: Sign in attempted with:', email);
    return { 
      success: true, 
      user: { 
        id: 'demo-user-' + Date.now(), 
        email, 
        name: 'Demo User' 
      },
      session: { access_token: 'demo-token-' + Date.now() }
    };
  },
  
  async getCurrentSession() {
    return { success: true, session: null };
  },
  
  async signOut() {
    return { success: true };
  }
};

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  mobile: string;
  gender: 'male' | 'female';
  age?: string;
  height?: string;
  interests?: string[];
  city?: string;
  skinTone?: string;
  instagram?: string;
  partnerAgeRange?: [number, number];
  partnerHeightRange?: string;
  partnerSkinTone?: string;
  partnerInterests?: string;
  lookingFor?: string;
  hasPaid?: boolean;
  paymentDate?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
}

// Authentication functions
export const authAPI = {
  async signUp(userData: {
    email: string;
    password: string;
    name: string;
    mobile: string;
    gender: 'male' | 'female';
  }) {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        return demoAuthHandlers.signUp(userData);
      }
      
      const { email, password, name, mobile, gender } = userData;

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: name
      });

      // Store additional user profile data in Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        email,
        name,
        mobile,
        gender,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return { 
        success: true, 
        user: { 
          id: user.uid, 
          email, 
          name, 
          mobile, 
          gender 
        } 
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message || 'Sign up failed', success: false };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        return demoAuthHandlers.signIn(email, password);
      }
      
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;

      return { 
        success: true, 
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName
        },
        session: { access_token: await user.getIdToken() }
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: error.message || 'Sign in failed', success: false };
    }
  },

  async signOut() {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        return demoAuthHandlers.signOut();
      }
      
      await signOut(firebaseAuth);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: error.message || 'Sign out failed', success: false };
    }
  },

  async getCurrentSession() {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        return demoAuthHandlers.getCurrentSession();
      }
      
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          unsubscribe(); // Unsubscribe immediately after getting the current state
          
          if (user) {
            try {
              const token = await user.getIdToken();
              resolve({ 
                success: true, 
                session: { 
                  access_token: token,
                  user: {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName
                  }
                }
              });
            } catch (error: any) {
              console.error('Token generation failed:', error);
              resolve({ error: error.message || 'Token generation failed', success: false });
            }
          } else {
            resolve({ success: true, session: null });
          }
        });
        
        // Add timeout to prevent hanging
        setTimeout(() => {
          unsubscribe();
          resolve({ success: true, session: null });
        }, 3000);
      });
    } catch (error: any) {
      console.error('Session check failed:', error);
      return { error: error.message || 'Session check failed', success: false };
    }
  },

  async signInWithGoogle() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return { error: 'Google sign-in is only available in the browser', success: false };
      }

      console.log('Initiating Google OAuth...');
      
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, return demo response
      if (!firebaseAuth) {
        console.log('Demo mode: Google OAuth attempted');
        return { 
          success: true, 
          user: {
            id: 'demo-google-user-' + Date.now(),
            email: 'demo@gmail.com',
            name: 'Demo Google User'
          }
        };
      }
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile for Google sign-in user
        const userProfile: Partial<UserProfile> = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
      }

      console.log('Google OAuth successful:', user);
      return { 
        success: true, 
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName
        }
      };
    } catch (error: any) {
      console.error('Google sign in failed:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { error: 'Google sign-in was cancelled', success: false };
      }
      
      return { error: error.message || 'Google sign in failed', success: false };
    }
  }
};

// Profile management functions
export const profileAPI = {
  async updateProfile(profileData: Partial<UserProfile>) {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        console.log('Demo mode: Profile update attempted with:', profileData);
        return { success: true, profile: profileData };
      }
      
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      const userRef = doc(db, 'users', user.uid);
      const updatedData = {
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userRef, updatedData);

      return { success: true, profile: updatedData };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error: error.message || 'Profile update failed', success: false };
    }
  },

  async getProfile() {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        console.log('Demo mode: Profile fetch attempted');
        return { 
          success: true, 
          profile: { 
            id: 'demo-user', 
            name: 'Demo User', 
            email: 'demo@example.com' 
          } 
        };
      }
      
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        return { error: 'Profile not found', success: false };
      }

      return { success: true, profile: userDoc.data() };
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      return { error: error.message || 'Profile fetch failed', success: false };
    }
  }
};

// Matching functions
export const matchAPI = {
  async findMatches() {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        console.log('Demo mode: Find matches attempted');
        const demoMatches = [
          { 
            id: 'demo-match-1', 
            name: 'Alex Johnson', 
            age: '25', 
            city: 'Mumbai',
            interests: ['Travel', 'Photography'],
            instagram: '@alexj_photos'
          },
          { 
            id: 'demo-match-2', 
            name: 'Sarah Williams', 
            age: '27', 
            city: 'Delhi',
            interests: ['Music', 'Dancing'],
            instagram: '@sarah_beats'
          }
        ];
        return { 
          success: true, 
          matchCount: demoMatches.length,
          matches: demoMatches 
        };
      }
      
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Get current user's profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        return { error: 'User profile not found', success: false };
      }

      const userProfile = userDoc.data() as UserProfile;

      // Get all users of opposite gender
      const oppositeGender = userProfile.gender === 'male' ? 'female' : 'male';
      const q = query(
        collection(db, 'users'),
        where('gender', '==', oppositeGender)
      );

      const querySnapshot = await getDocs(q);
      const potentialMatches: UserProfile[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          const profile = doc.data() as UserProfile;
          if (profile.age && profile.city) {
            potentialMatches.push(profile);
          }
        }
      });

      // Simple matching algorithm based on preferences
      const matches = potentialMatches.filter(match => {
        // Age range matching
        if (userProfile.partnerAgeRange) {
          const [minAge, maxAge] = userProfile.partnerAgeRange;
          const matchAge = parseInt(match.age || '0');
          if (matchAge < minAge || matchAge > maxAge) return false;
        }

        // City matching (optional preference)
        if (userProfile.lookingFor === 'same_city' && match.city !== userProfile.city) {
          return false;
        }

        // Interest matching (basic implementation)
        if (userProfile.partnerInterests && match.interests) {
          const userInterests = userProfile.partnerInterests.toLowerCase();
          const matchInterests = match.interests.map(i => i.toLowerCase()).join(' ');
          const hasCommonInterest = userInterests.split(' ').some(interest => 
            matchInterests.includes(interest)
          );
          if (!hasCommonInterest) return false;
        }

        return true;
      });

      // Shuffle and limit results
      const shuffledMatches = matches.sort(() => Math.random() - 0.5).slice(0, 3);
      
      // Store match results for user
      const matchData = {
        matches: shuffledMatches,
        generatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'matches', user.uid), matchData);

      return { 
        success: true, 
        matchCount: shuffledMatches.length,
        matches: shuffledMatches 
      };
    } catch (error: any) {
      console.error('Find matches error:', error);
      return { error: error.message || 'Find matches failed', success: false };
    }
  },

  async getMatches() {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        console.log('Demo mode: Get matches attempted');
        return { success: true, matches: [] };
      }
      
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      const matchDoc = await getDoc(doc(db, 'matches', user.uid));
      
      if (!matchDoc.exists()) {
        return { success: true, matches: [] };
      }

      return { success: true, ...matchDoc.data() };
    } catch (error: any) {
      console.error('Get matches error:', error);
      return { error: error.message || 'Get matches failed', success: false };
    }
  }
};

// Verification functions
export const verificationAPI = {
  async verifyOTP(mobile: string, otp: string) {
    try {
      // For demo purposes, accept any 6-digit OTP
      if (!otp || otp.length !== 6) {
        return { error: 'Invalid OTP format', success: false };
      }

      // In production, you would verify the actual OTP here
      return { success: true, verified: true };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return { error: error.message || 'OTP verification failed', success: false };
    }
  }
};

// Payment functions
export const paymentAPI = {
  async processPayment(amount: number, method: string) {
    try {
      const firebaseAuth = checkFirebaseAuth();
      
      // If Firebase is not configured, use demo mode
      if (!firebaseAuth) {
        console.log('Demo mode: Payment attempted -', amount, method);
        return { 
          success: true, 
          paymentId: `demo_pay_${Date.now()}`,
          status: 'completed' 
        };
      }
      
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Simulate payment processing
      if (amount !== 49) {
        return { error: 'Invalid payment amount', success: false };
      }

      // Update user profile with payment status
      const userRef = doc(db, 'users', user.uid);
      const paymentData = {
        hasPaid: true,
        paymentDate: new Date().toISOString(),
        paymentAmount: amount,
        paymentMethod: method,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userRef, paymentData);

      return { 
        success: true, 
        paymentId: `pay_${Date.now()}`,
        status: 'completed' 
      };
    } catch (error: any) {
      console.error('Payment processing error:', error);
      return { error: error.message || 'Payment processing failed', success: false };
    }
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  try {
    const firebaseAuth = checkFirebaseAuth();
    
    // If Firebase is not configured, return a no-op subscription
    if (!firebaseAuth) {
      console.log('Demo mode: Auth state listener setup');
      // Call callback with null initially (no user signed in)
      setTimeout(() => callback(null), 100);
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => console.log('Demo mode: Auth state listener unsubscribed')
          } 
        } 
      };
    }
    
    const unsubscribe = onAuthStateChanged(firebaseAuth, callback);
    return { data: { subscription: { unsubscribe } } };
  } catch (error: any) {
    console.error('Auth state listener error:', error);
    return { 
      data: { 
        subscription: { 
          unsubscribe: () => {} // Return a no-op function to prevent errors
        } 
      }, 
      error: error.message 
    };
  }
};