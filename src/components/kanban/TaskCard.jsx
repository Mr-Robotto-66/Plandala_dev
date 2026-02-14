import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MessageSquare, Image, User } from 'lucide-react';

export const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'high_priority':
        return 'border-plandala-magenta-400';
      case 'in_progress':
        return 'border-plandala-blue-400';
      case 'not_started':
        return 'border-plandala-cyan-400';
      case 'testing':
        return 'border-orange-400';
      case 'done':
        return 'border-green-400';
      default:
        return 'border-plandala-border';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        glass-card p-4 cursor-pointer
        hover:border-opacity-100 transition-all
        ${getStatusColor(task.status)}
        ${isDragging ? 'drag-overlay' : ''}
      `}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-start justify-between mb-2"
      >
        <h3 className="text-plandala-text font-medium flex-1 pr-2">
          {task.title}
        </h3>
        <GripVertical
          size={16}
          className="text-plandala-muted cursor-grab active:cursor-grabbing flex-shrink-0"
        />
      </div>

      {/* Task description preview */}
      {task.description && (
        <p className="text-sm text-plandala-muted mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task metadata */}
      <div className="flex items-center justify-between text-xs text-plandala-muted">
        <div className="flex items-center space-x-3">
          {/* Comment count */}
          {task.metadata?.commentCount > 0 && (
            <div className="flex items-center space-x-1">
              <MessageSquare size={14} />
              <span>{task.metadata.commentCount}</span>
            </div>
          )}

          {/* Image count */}
          {task.metadata?.imageCount > 0 && (
            <div className="flex items-center space-x-1">
              <Image size={14} />
              <span>{task.metadata.imageCount}</span>
            </div>
          )}
        </div>

        {/* Assignee */}
        {task.assignedTo && (
          <div className="flex items-center space-x-1 text-plandala-cyan-400">
            <User size={14} />
            <span>{task.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
