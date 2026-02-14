import { useState, useCallback } from 'react';
import { useComments } from '../../hooks/useComments';
import { useUser } from '../../context/UserContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ImageUpload } from './ImageUpload';
import { Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const CommentSection = ({ taskId }) => {
  const { comments, addComment, removeComment, loading, error } = useComments(taskId);
  const { userName } = useUser();
  const [newComment, setNewComment] = useState('');
  const [commentImages, setCommentImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && commentImages.length === 0) return;

    try {
      setSubmitting(true);
      await addComment(newComment, commentImages);
      setNewComment('');
      setCommentImages([]);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await removeComment(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleImagesUploaded = useCallback((urls) => {
    setCommentImages((prev) => [...prev, ...urls]);
  }, []);

  const handleImageRemoved = useCallback((url) => {
    setCommentImages((prev) => prev.filter((imageUrl) => imageUrl !== url));
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, HH:mm');
    } catch (err) {
      return 'Unknown';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        <p className="font-medium mb-1">Failed to load comments</p>
        <p className="text-xs text-plandala-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-plandala-muted text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="glass-card p-4 hover:border-plandala-border transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-plandala-cyan-400">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-plandala-muted">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {comment.userName === userName && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 rounded hover:bg-plandala-surface transition-colors text-plandala-muted hover:text-red-400"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <p className="text-plandala-text text-sm whitespace-pre-wrap">
                {comment.text}
              </p>

              {/* Comment images */}
              {comment.imageUrls && comment.imageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {comment.imageUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video rounded overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={url}
                        alt={`Comment image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-plandala-surface border border-plandala-border text-plandala-text placeholder-plandala-muted focus:outline-none focus:border-plandala-cyan-400 transition-colors resize-none"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || (!newComment.trim() && commentImages.length === 0)}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-plandala-cyan-400 to-plandala-magenta-500 text-white hover:glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send comment"
          >
            {submitting ? (
              <LoadingSpinner size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Image Upload */}
        <ImageUpload
          onImagesUploaded={handleImagesUploaded}
          onImageRemoved={handleImageRemoved}
          existingImages={commentImages}
          folder={`comment-images/${taskId}`}
        />
      </form>
    </div>
  );
};
