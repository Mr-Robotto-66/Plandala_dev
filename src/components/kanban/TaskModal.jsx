import { useState } from 'react';
import { X, Trash2, Edit2 } from 'lucide-react';
import { TaskForm } from '../task/TaskForm';
import { CommentSection } from '../task/CommentSection';
import { useTasks } from '../../hooks/useTasks';
import { format } from 'date-fns';

export const TaskModal = ({ task, onClose }) => {
  const { removeTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const handleDelete = async () => {
    try {
      await removeTask(task.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      // Firestore timestamp to Date
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (err) {
      return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-plandala-surface/95 backdrop-blur-sm p-6 border-b border-plandala-border flex items-start justify-between">
          <div className="flex-1 pr-4">
            {!isEditing && (
              <>
                <h2 className="text-2xl font-bold text-plandala-text mb-2">
                  {task.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-plandala-muted">
                  <span>Created by {task.createdBy}</span>
                  <span>•</span>
                  <span>{formatDate(task.createdAt)}</span>
                  {task.assignedTo && (
                    <>
                      <span>•</span>
                      <span className="text-plandala-cyan-400">
                        Assigned to {task.assignedTo}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg hover:bg-plandala-surface transition-colors text-plandala-cyan-400"
                  aria-label="Edit task"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg hover:bg-plandala-surface transition-colors text-red-400"
                  aria-label="Delete task"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-plandala-surface transition-colors text-plandala-muted hover:text-plandala-text"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <TaskForm
              task={task}
              onClose={() => setIsEditing(false)}
              onSave={handleSave}
            />
          ) : (
            <div className="space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-sm font-medium text-plandala-text mb-2">
                    Description
                  </h3>
                  <p className="text-plandala-muted whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Images */}
              {task.imageUrls && task.imageUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-plandala-text mb-3">
                    Images ({task.imageUrls.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {task.imageUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-video rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={url}
                          alt={`Task image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="border-t border-plandala-border pt-6">
                <h3 className="text-sm font-medium text-plandala-text mb-4">
                  Comments {task.metadata?.commentCount > 0 && `(${task.metadata.commentCount})`}
                </h3>
                <CommentSection taskId={task.id} />
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-plandala-text mb-2">
                Delete Task?
              </h3>
              <p className="text-plandala-muted mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-plandala-muted hover:text-plandala-text hover:bg-plandala-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
