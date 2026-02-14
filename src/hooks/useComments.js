import { useState, useEffect } from 'react';
import { createComment, deleteComment, subscribeToComments } from '../lib/firestore';
import { useUser } from '../context/UserContext';

export const useComments = (taskId) => {
  const { userName } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    // Subscribe to real-time comments
    const unsubscribe = subscribeToComments(taskId, (updatedComments) => {
      setComments(updatedComments);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [taskId]);

  const addComment = async (text, imageUrls = []) => {
    try {
      if (!text.trim() && imageUrls.length === 0) {
        throw new Error('Comment must have text or images');
      }

      const commentData = {
        taskId,
        text: text.trim(),
        userName: userName || 'Anonymous',
        imageUrls,
      };

      const commentId = await createComment(commentData);
      return commentId;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
      throw err;
    }
  };

  const removeComment = async (commentId) => {
    try {
      await deleteComment(commentId, taskId);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    comments,
    addComment,
    removeComment,
    loading,
    error,
  };
};
