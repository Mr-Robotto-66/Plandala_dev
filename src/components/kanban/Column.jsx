import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const Column = ({
  id,
  title,
  tasks = [],
  onTaskClick,
  onAddTask,
  colorClass = 'text-plandala-cyan-400',
  columnClass = 'column-not-started'
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className={`glass-card p-6 ${columnClass} flex flex-col h-full`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className={`text-xl font-bold ${colorClass}`}>
            {title}
          </h2>
          <span className="text-sm text-plandala-muted bg-plandala-surface px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={onAddTask}
          className="p-2 rounded-lg hover:bg-plandala-surface transition-colors text-plandala-muted hover:text-plandala-text"
          aria-label="Add task"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 space-y-3 overflow-y-auto
          ${isOver ? 'bg-plandala-surface/20 rounded-lg' : ''}
          transition-colors
        `}
        style={{ minHeight: '200px' }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-plandala-muted text-sm">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};
