import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { PageLayout } from '../components/layout/PageLayout';
import { Column } from '../components/kanban/Column';
import { TaskCard } from '../components/kanban/TaskCard';
import { TaskModal } from '../components/kanban/TaskModal';
import { TaskForm } from '../components/task/TaskForm';
import { Modal } from '../components/common/Modal';
import { useTaskContext } from '../context/TaskContext';
import { useTasks } from '../hooks/useTasks';
import { FullPageLoader } from '../components/common/LoadingSpinner';

export const KanbanPage = () => {
  const { getTasksByPageAndStatus, loading: tasksLoading, getTaskById } = useTaskContext();
  const { moveTask, reorderTasks } = useTasks();
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState('not_started');

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Column definitions
  const columns = [
    {
      id: 'high_priority',
      title: 'High Priority',
      status: 'high_priority',
      colorClass: 'text-plandala-magenta-400',
      columnClass: 'column-high-priority',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: 'in_progress',
      colorClass: 'text-plandala-blue-400',
      columnClass: 'column-in-progress',
    },
    {
      id: 'not_started',
      title: 'Not Started',
      status: 'not_started',
      colorClass: 'text-plandala-cyan-400',
      columnClass: 'column-not-started',
    },
  ];

  // Get tasks for each column
  const getColumnTasks = (status) => {
    return getTasksByPageAndStatus('kanban', status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = getTaskById(active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = getTaskById(active.id);
    const overColumn = columns.find((col) => col.id === over.id);

    // Moving to a different column
    if (overColumn && activeTask.status !== overColumn.status) {
      await moveTask(active.id, overColumn.status, 'kanban');
      return;
    }

    // Reordering within the same column
    const activeColumn = columns.find((col) => col.status === activeTask.status);
    if (activeColumn) {
      const columnTasks = getColumnTasks(activeColumn.status);
      const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== newIndex && newIndex !== -1) {
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        await reorderTasks(reorderedTasks);
      }
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddTask = (status) => {
    setCreateTaskStatus(status);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  if (tasksLoading) {
    return <FullPageLoader />;
  }

  return (
    <PageLayout
      title="Kanban Board"
      description="Organize and prioritize your development tasks"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getColumnTasks(column.status)}
              onTaskClick={handleTaskClick}
              onAddTask={() => handleAddTask(column.status)}
              colorClass={column.colorClass}
              columnClass={column.columnClass}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} />
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create New Task"
      >
        <TaskForm
          defaultStatus={createTaskStatus}
          defaultPage="kanban"
          onClose={handleCloseCreateModal}
        />
      </Modal>
    </PageLayout>
  );
};
