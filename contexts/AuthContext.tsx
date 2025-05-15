// src/context/AuthContext.tsx
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
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
  checkSignInLink,
  completeSignInWithEmailLink,
  removeAuthToken,
  sendSignInLink,
  storeAuthToken
} from '../services/firebase';

// ─── Context types ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  sendLoginLink: (email: string) => Promise<boolean>;
  completeLoginWithLink: (email: string, link: string) => Promise<void>;
  isAuthLink: (link: string) => boolean;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// ─── Context creation ─────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      
      // If user logged in, store token for persistence
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await storeAuthToken(token);
        } catch (e) {
          console.error('Failed to store auth token:', e);
        }
      }
      
      setLoading(false);
    });
    return unsubscribe; // cleanup
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      const msg = e.message || 'Failed to login';
      console.error('Login error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Send a login link to the user's email
  const sendLoginLink = async (email: string) => {
    setError(null);
    if (!email.endsWith('.edu')) {
      const msg = 'Email must be a .edu email address';
      setError(msg);
      throw new Error(msg);
    }
    
    try {
      setLoading(true);
      const result = await sendSignInLink(email);
      if (!result) {
        const msg = 'Failed to send login link';
        setError(msg);
        throw new Error(msg);
      }
      return true;
    } catch (e: any) {
      const msg = e.message || 'Failed to send login link';
      console.error('Send login link error:', msg);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Check if the provided link is a valid authentication link
  const isAuthLink = (link: string) => {
    return checkSignInLink(link);
  };

  // Complete the login process with the email link
  const completeLoginWithLink = async (email: string, link: string) => {
    setError(null);
    try {
      setLoading(true);
      await completeSignInWithEmailLink(email, link);
    } catch (e: any) {
      const msg = e.message || 'Failed to complete login';
      console.error('Complete login error:', msg);
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
        login, 
        sendLoginLink, 
        completeLoginWithLink,
        isAuthLink, 
        logout, 
        error, 
        clearError 
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
