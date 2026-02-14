import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    // Get user name from localStorage
    return localStorage.getItem('plandala_user_name') || null;
  });

  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt if no user name is set
    if (!userName) {
      setShowPrompt(true);
    }
  }, [userName]);

  const saveUserName = (name) => {
    if (name && name.trim()) {
      const trimmedName = name.trim();
      setUserName(trimmedName);
      localStorage.setItem('plandala_user_name', trimmedName);
      setShowPrompt(false);
    }
  };

  const clearUserName = () => {
    setUserName(null);
    localStorage.removeItem('plandala_user_name');
    setShowPrompt(true);
  };

  const requestNameChange = () => {
    setShowPrompt(true);
  };

  const value = {
    userName,
    saveUserName,
    clearUserName,
    requestNameChange,
    showPrompt,
    setShowPrompt,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
