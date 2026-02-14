import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
export const tasksCollection = collection(db, 'tasks');
export const commentsCollection = collection(db, 'comments');

// Task operations
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(tasksCollection, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {
        commentCount: 0,
        imageCount: taskData.imageUrls?.length || 0,
      },
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const addImageToTask = async (taskId, imageUrl) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      imageUrls: arrayUnion(imageUrl),
      'metadata.imageCount': arrayUnion(imageUrl).length,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding image to task:', error);
    throw error;
  }
};

// Comment operations
export const createComment = async (commentData) => {
  try {
    const docRef = await addDoc(commentsCollection, {
      ...commentData,
      createdAt: serverTimestamp(),
    });

    // Update task comment count
    const taskRef = doc(db, 'tasks', commentData.taskId);
    await updateDoc(taskRef, {
      'metadata.commentCount': increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId, taskId) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);

    // Update task comment count
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      'metadata.commentCount': increment(-1),
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Query helpers
export const subscribeToTasks = (callback, onError) => {
  const q = query(tasksCollection, orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tasks);
    },
    (error) => {
      console.error('Error in tasks subscription:', error);
      if (onError) {
        onError(error);
      }
    }
  );
};

export const subscribeToComments = (taskId, callback) => {
  const q = query(
    commentsCollection,
    where('taskId', '==', taskId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
};
