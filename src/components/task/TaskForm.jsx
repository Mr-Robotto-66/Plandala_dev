import { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '../../context/UserContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ImageUpload } from './ImageUpload';
import { Save, X } from 'lucide-react';

export const TaskForm = ({ task = null, onClose, onSave, defaultStatus, defaultPage }) => {
  const { addTask, editTask, loading } = useTasks();
  const { userName } = useUser();

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo || '',
    status: task?.status || defaultStatus || 'not_started',
    page: task?.page || defaultPage || 'kanban',
    imageUrls: task?.imageUrls || [],
  });

  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'high_priority', label: 'High Priority', page: 'kanban' },
    { value: 'in_progress', label: 'In Progress', page: 'kanban' },
    { value: 'not_started', label: 'Not Started', page: 'kanban' },
    { value: 'testing', label: 'Testing', page: 'testing' },
    { value: 'done', label: 'Done', page: 'done' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      // Automatically set page based on status
      const selectedStatus = statusOptions.find(opt => opt.value === formData.status);
      const updatedFormData = {
        ...formData,
        page: selectedStatus?.page || formData.page,
      };

      if (task) {
        // Edit existing task
        await editTask(task.id, updatedFormData);
      } else {
        // Create new task
        await addTask(updatedFormData);
      }

      if (onSave) {
        onSave();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to save task');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesUploaded = useCallback((urls) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...urls],
    }));
  }, []);

  const handleImageRemoved = useCallback((url) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((imageUrl) => imageUrl !== url),
    }));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-plandala-text mb-2">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title"
          className="w-full px-4 py-3 rounded-lg bg-plandala-surface border border-plandala-border text-plandala-text placeholder-plandala-muted focus:outline-none focus:border-plandala-cyan-400 transition-colors"
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-plandala-text mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter task description"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-plandala-surface border border-plandala-border text-plandala-text placeholder-plandala-muted focus:outline-none focus:border-plandala-cyan-400 transition-colors resize-none"
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-plandala-text mb-2">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-plandala-surface border border-plandala-border text-plandala-text focus:outline-none focus:border-plandala-cyan-400 transition-colors"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Assigned To */}
      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-plandala-text mb-2">
          Assign To
        </label>
        <input
          type="text"
          id="assignedTo"
          value={formData.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          placeholder="Enter assignee name"
          className="w-full px-4 py-3 rounded-lg bg-plandala-surface border border-plandala-border text-plandala-text placeholder-plandala-muted focus:outline-none focus:border-plandala-cyan-400 transition-colors"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-plandala-text mb-2">
          {task ? 'Manage Images' : 'Attach Images'}
        </label>
        <ImageUpload
          onImagesUploaded={handleImagesUploaded}
          onImageRemoved={handleImageRemoved}
          existingImages={formData.imageUrls}
          folder={`task-images/${task?.id || Date.now()}`}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-plandala-muted hover:text-plandala-text hover:bg-plandala-surface transition-colors"
            disabled={loading}
          >
            <X size={18} className="inline mr-2" />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-plandala-cyan-400 to-plandala-magenta-500 text-white font-medium hover:glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size={18} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{task ? 'Update Task' : 'Create Task'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
