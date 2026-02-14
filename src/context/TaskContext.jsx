import { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToTasks } from '../lib/firestore';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to real-time task updates
    const unsubscribe = subscribeToTasks(
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      },
      (error) => {
        console.error('Error subscribing to tasks:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Helper functions to filter tasks
  const getTasksByPage = (page) => {
    return tasks.filter((task) => task.page === page);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const getTasksByPageAndStatus = (page, status) => {
    return tasks.filter(
      (task) => task.page === page && task.status === status
    );
  };

  const getTaskById = (taskId) => {
    return tasks.find((task) => task.id === taskId);
  };

  const value = {
    tasks,
    loading,
    error,
    getTasksByPage,
    getTasksByStatus,
    getTasksByPageAndStatus,
    getTaskById,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
