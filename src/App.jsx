import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';
import { UserPrompt } from './components/common/UserPrompt';
import { KanbanPage } from './pages/KanbanPage';
import { TestingPage } from './pages/TestingPage';
import { DonePage } from './pages/DonePage';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TaskProvider>
          <Router>
            <UserPrompt />
            <Routes>
              <Route path="/" element={<KanbanPage />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/done" element={<DonePage />} />
            </Routes>
          </Router>
        </TaskProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
