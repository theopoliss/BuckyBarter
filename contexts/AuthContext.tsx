// src/context/AuthContext.tsx
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  auth,
  registerWithEmailAndPassword,
  removeAuthToken,
  sendPasswordReset,
  sendVerificationEmail,
  storeAuthToken,
} from '../services/firebase';

// Import UserProfile and getUserProfile from firestore.ts
import { getUserProfile, UserProfile } from '../services/firestore';

// Combined User type for our app context
// UserProfile.email is string. FirebaseUser.email is string | null.
// We define AppUser to handle this potential conflict.
export type AppUser = Omit<FirebaseUser, 'email'> & Omit<Partial<UserProfile>, 'email'> & {
  email: string | null; // Final email type for AppUser, can accommodate FirebaseUser.email
  // Other fields from FirebaseUser (excluding email) are present.
  // Other fields from UserProfile (excluding email) are optional and overlayed.
};

// ─── Context types ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  authInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<FirebaseUser>;
  sendVerification: (user: FirebaseUser) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  fetchUserProfile: (uid: string) => Promise<UserProfile | null>;
}

// ─── Context creation ─────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppUserProfile = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const { email: fbEmail, ...restFirebaseUserFields } = firebaseUser;
    const userProfileData = await getUserProfile(firebaseUser.uid);
    const { email: profileEmail, ...restUserProfileFields } = (userProfileData || {}) as Partial<UserProfile>;

    return {
      ...restFirebaseUserFields,
      ...restUserProfileFields,
      email: fbEmail,
    } as AppUser;
  };

  // Listen for auth changes
  useEffect(() => {
    setLoading(true); 
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          const appUser = await fetchAppUserProfile(firebaseUser);
          setUser(appUser);
          const token = await firebaseUser.getIdToken();
          await storeAuthToken(token);
        } catch (e) {
          console.error('Error fetching user profile or storing token:', e);
          // Fallback: create a minimal AppUser from FirebaseUser
          const { email: fbEmail, ...restFbFields } = firebaseUser;
          setUser({ ...restFbFields, email: fbEmail } as AppUser);
        }
      } else {
        setUser(null);
        await removeAuthToken();
      }
      setLoading(false);
      setAuthInitialized(true);
    });
    return unsubscribe; // cleanup
  }, []);

  const fetchUserProfileForContext = async (uid: string) => {
    const profile = await getUserProfile(uid);
    if (user && user.uid === uid) { 
        setUser((prevUser: AppUser | null) => {
            if (!prevUser) return null;
            const { email: prevEmail, ...restOfPrevUser } = prevUser;
            const { email: profileEmail, ...restOfProfile } = profile || {};
            return {
                ...restOfPrevUser,
                ...restOfProfile,
                email: profileEmail || prevEmail, // If profile has email, use it, else keep prev email
            } as AppUser;
        });
    }
    return profile;
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the full AppUser
    } catch (e: any) {
      const msg = e.message || 'Failed to login';
      console.error('Login error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Register a new user with email and password
  const register = async (email: string, password: string) => {
    setError(null);
    if (!email.endsWith('.edu')) {
      const msg = 'Email must be a .edu email address';
      setError(msg);
      throw new Error(msg);
    }
    
    try {
      setLoading(true);
      const firebaseUser = await registerWithEmailAndPassword(email, password);
      // After registration, Firestore profile might be created separately (e.g., via a function trigger or next step in UI)
      // onAuthStateChanged will pick up the new FirebaseUser and attempt to fetch profile.
      return firebaseUser;
    } catch (e: any) {
      const msg = e.message || 'Failed to register';
      console.error('Registration error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Send email verification
  const sendVerification = async (firebaseUser: FirebaseUser) => {
    setError(null);
    try {
      setLoading(true);
      return await sendVerificationEmail(firebaseUser);
    } catch (e: any) {
      const msg = e.message || 'Failed to send verification email';
      console.error('Verification error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Send password reset email
  const handleSendPasswordReset = async (email: string) => {
    setError(null);
    if (!email) {
      const msg = 'Email is required';
      setError(msg);
      throw new Error(msg);
    }
    
    try {
      setLoading(true);
      return await sendPasswordReset(email);
    } catch (e: any) {
      const msg = e.message || 'Failed to send password reset email';
      console.error('Password reset error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      setLoading(true);
      await signOut(auth);
      await removeAuthToken();
    } catch (e: any) {
      const msg = e.message || 'Failed to logout';
      console.error('Logout error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        authInitialized,
        login, 
        register,
        sendVerification,
        sendPasswordReset: handleSendPasswordReset,
        logout, 
        error, 
        clearError,
        fetchUserProfile: fetchUserProfileForContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
