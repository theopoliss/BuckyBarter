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
    registerWithEmailAndPassword,
    removeAuthToken,
    sendPasswordReset,
    sendVerificationEmail,
    storeAuthToken
} from '../services/firebase';

// ─── Context types ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
  sendVerification: (user: User) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
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
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      setLoading(false);
      setAuthInitialized(true);
      
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await storeAuthToken(token);
        } catch (e) {
          console.error('Failed to store auth token:', e);
        }
      } else {
        await removeAuthToken();
      }
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
      const user = await registerWithEmailAndPassword(email, password);
      return user;
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
  const sendVerification = async (user: User) => {
    setError(null);
    try {
      setLoading(true);
      return await sendVerificationEmail(user);
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
