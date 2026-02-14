import { createContext, useContext, useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setError('Firebase not configured');
      setLoading(false);
      return;
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Sign in anonymously if not already signed in
    signInAnonymously(auth).catch((error) => {
      console.error('Anonymous sign-in error:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
