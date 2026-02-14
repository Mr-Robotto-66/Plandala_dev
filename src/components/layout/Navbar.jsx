import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { ThemeToggle } from './ThemeToggle';
import { KanbanSquare, TestTube, CheckCircle2, User } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { userName, requestNameChange } = useUser();

  const navLinks = [
    { path: '/', label: 'Kanban', icon: KanbanSquare },
    { path: '/testing', label: 'Testing', icon: TestTube },
    { path: '/done', label: 'Done', icon: CheckCircle2 },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 glass-card border-b border-plandala-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold gradient-text">
              Plandala
            </div>
            <div className="hidden sm:block text-sm text-plandala-muted">
              Dev Team
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                    ${
                      active
                        ? 'bg-gradient-to-r from-plandala-cyan-400 to-plandala-magenta-500 text-white glow-cyan'
                        : 'text-plandala-muted hover:text-plandala-text hover:bg-plandala-surface'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Theme Toggle */}
          <div className="flex items-center space-x-3">
            {userName && (
              <button
                onClick={requestNameChange}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-plandala-surface border border-plandala-border hover:border-plandala-cyan-400 transition-all text-sm"
              >
                <User size={16} className="text-plandala-cyan-400" />
                <span className="hidden sm:inline text-plandala-text">
                  {userName}
                </span>
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
