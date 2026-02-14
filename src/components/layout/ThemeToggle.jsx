import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-plandala-surface border border-plandala-border hover:border-plandala-cyan-400 transition-all hover:glow-cyan"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-plandala-cyan-400" />
      ) : (
        <Moon size={20} className="text-plandala-blue-500" />
      )}
    </button>
  );
};
