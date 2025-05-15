import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    Auth,
    getAuth,
    isSignInWithEmailLink,
    sendSignInLinkToEmail,
    signInWithEmailLink
} from 'firebase/auth';
import { FIREBASE_CONFIG } from '../constants/firebase';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Auth based on platform
const auth: Auth = getAuth(app);

// Email for passwordless sign-in
export const EMAIL_KEY = '@BuckyBarter:email';

// Get the right URL for the environment
const getActionCodeUrl = () => {
  // For Expo Go development, use Expo's auth proxy (replace with your username)
  if (__DEV__) {
    // TODO: Replace 'your-expo-username' with your actual Expo username
    // You can find this by running 'expo whoami' in the terminal
    return 'https://auth.expo.io/@theoluo/BuckyBarter';
  } else {
    // Production environment - use your app domain
    return 'https://buckybarter.firebaseapp.com/finishSignUp';
  }
};

// ActionCodeSettings for email link
export const actionCodeSettings = {
  url: getActionCodeUrl(),
  handleCodeInApp: true,
  // These settings should match your Expo config
  iOS: {
    bundleId: __DEV__ ? 'host.exp.exponent' : 'com.buckybarter.app'
  },
  android: {
    packageName: __DEV__ ? 'host.exp.exponent' : 'com.buckybarter.app',
    installApp: false,
    minimumVersion: '1'
  },
  // Needed for Expo Go authentication
  dynamicLinkDomain: 'auth.expo.io'
};

// Helper to send sign-in link to email
export const sendSignInLink = async (email: string) => {
  try {
    console.log('Sending sign-in link to:', email);
    console.log('Using action code settings:', actionCodeSettings);
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    // Save the email for later use
    await AsyncStorage.setItem(EMAIL_KEY, email);
    
    console.log('Sign-in link sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending sign-in link:', error);
    return false;
  }
};

// Helper to check if link is a sign-in link
export const checkSignInLink = (link: string) => {
  console.log('Checking if this is a sign-in link:', link);
  const isValid = isSignInWithEmailLink(auth, link);
  console.log('Is valid sign-in link:', isValid);
  return isValid;
};

// Helper to complete sign-in with email link
export const completeSignInWithEmailLink = async (email: string, link: string) => {
  try {
    console.log('Completing sign-in for email:', email);
    console.log('With link:', link);
    
    const result = await signInWithEmailLink(auth, email, link);
    console.log('Sign-in completed successfully');
    return result;
  } catch (error) {
    console.error('Error completing sign-in:', error);
    throw error;
  }
};

// Token storage key for manual persistence
export const AUTH_TOKEN_KEY = '@BuckyBarter:authToken';

// Helper to store auth token in AsyncStorage
export const storeAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error storing auth token:', error);
    return false;
  }
};

// Helper to retrieve auth token from AsyncStorage
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper to retrieve stored email
export const getStoredEmail = async () => {
  try {
    return await AsyncStorage.getItem(EMAIL_KEY);
  } catch (error) {
    console.error('Error getting stored email:', error);
    return null;
  }
};

// Helper to remove auth token from AsyncStorage
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing auth token:', error);
    return false;
  }
};

export { app, auth };

