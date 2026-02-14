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

export const DonePage = () => {
  const { getTasksByPageAndStatus, loading: tasksLoading, getTaskById } = useTaskContext();
  const { reorderTasks } = useTasks();
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get tasks for done column
  const getColumnTasks = () => {
    return getTasksByPageAndStatus('done', 'done')
      .sort((a, b) => b.order - a.order); // Reverse order (newest first)
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = getTaskById(active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    // Reordering within the done column
    const columnTasks = getColumnTasks();
    const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
    const newIndex = columnTasks.findIndex((task) => task.id === over.id);

    if (oldIndex !== newIndex && newIndex !== -1) {
      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
      await reorderTasks(reorderedTasks);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddTask = () => {
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
      title="Completed Tasks"
      description="All finished and shipped features"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-2xl mx-auto h-[calc(100vh-12rem)]">
          <Column
            id="done"
            title="Done"
            tasks={getColumnTasks()}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            colorClass="text-green-400"
            columnClass="column-done"
          />
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
          defaultStatus="done"
          defaultPage="done"
          onClose={handleCloseCreateModal}
        />
      </Modal>
    </PageLayout>
  );
};
