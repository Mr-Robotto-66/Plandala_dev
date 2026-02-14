import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '../lib/firestore';
import { useUser } from '../context/UserContext';

export const useTasks = () => {
  const { userName } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);

      const newTask = {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        page: taskData.page,
        assignedTo: taskData.assignedTo || null,
        createdBy: userName || 'Anonymous',
        imageUrls: taskData.imageUrls || [],
        order: taskData.order || Date.now(),
      };

      const taskId = await createTask(newTask);
      return taskId;
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (taskId, updates) => {
    try {
      setLoading(true);
      setError(null);
      await updateTask(taskId, updates);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, newStatus, newPage) => {
    try {
      setLoading(true);
      setError(null);

      const updates = {};
      if (newStatus !== undefined) {
        updates.status = newStatus;
      }
      if (newPage !== undefined) {
        updates.page = newPage;
      }

      await updateTask(taskId, updates);
    } catch (err) {
      console.error('Error moving task:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reorderTasks = async (tasks) => {
    try {
      setLoading(true);
      setError(null);

      // Update order for each task
      const promises = tasks.map((task, index) =>
        updateTask(task.id, { order: index })
      );

      await Promise.all(promises);
    } catch (err) {
      console.error('Error reordering tasks:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addTask,
    editTask,
    removeTask,
    moveTask,
    reorderTasks,
    loading,
    error,
  };
};
