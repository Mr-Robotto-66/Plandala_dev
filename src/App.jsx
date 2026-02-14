import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';
import { UserPrompt } from './components/common/UserPrompt';
import { KanbanPage } from './pages/KanbanPage';
import { TestingPage } from './pages/TestingPage';
import { DonePage } from './pages/DonePage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function AppContent() {
  const { loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400">Auth Error: {error}</div>
      </div>
    );
  }

  return (
    <Router>
      <UserPrompt />
      <Routes>
        <Route path="/" element={<KanbanPage />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/done" element={<DonePage />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <TaskProvider>
            <AppContent />
          </TaskProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
