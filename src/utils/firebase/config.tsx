import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Temporary demo Firebase configuration
// In production, these would be replaced with actual environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDemo_Replace_With_Your_Key_123456789",
  authDomain: "love-connect-demo.firebaseapp.com", 
  projectId: "love-connect-demo",
  storageBucket: "love-connect-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

console.log('🔥 Firebase Demo Configuration Loaded');
console.warn('⚠️ Using demo Firebase configuration. Please replace with your actual Firebase credentials for production.');
console.log('To configure Firebase properly:');
console.log('1. Create a Firebase project at https://console.firebase.google.com');
console.log('2. Enable Authentication with Email/Password and Google providers');
console.log('3. Create a Firestore database');
console.log('4. Replace the demo config above with your project settings');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

console.log('🔥 Firebase initialized successfully');

export { auth, db };
export default app;