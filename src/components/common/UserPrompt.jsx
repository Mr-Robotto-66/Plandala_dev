import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { X } from 'lucide-react';

export const UserPrompt = () => {
  const { showPrompt, saveUserName, setShowPrompt, userName } = useUser();
  const [name, setName] = useState(userName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
  }, [userName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    saveUserName(name);
    setError('');
  };

  const handleClose = () => {
    if (userName) {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-card p-8 max-w-md w-full mx-4 relative">
        {userName && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-plandala-muted hover:text-plandala-text transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <h2 className="text-2xl font-bold gradient-text mb-2">
          Welcome to Plandala
        </h2>
        <p className="text-plandala-muted mb-6">
          {userName ? 'Update your name' : 'Please enter your name to get started'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-plandala-text mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg bg-plandala-surface border border-plandala-border text-plandala-text placeholder-plandala-muted focus:outline-none focus:border-plandala-cyan-400 transition-colors"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-plandala-cyan-400 to-plandala-magenta-500 text-white font-medium hover:glow-cyan transition-all"
          >
            {userName ? 'Update Name' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
};
