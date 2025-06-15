import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Text from '../atoms/Text';
import ApperIcon from '../ApperIcon';
import { commentService } from '@/services';

const CommentsList = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await commentService.getByPostId(postId);
      setComments(result);
      if (onCommentCountChange) {
        onCommentCountChange(result.length);
      }
    } catch (err) {
      setError(err.message || 'Failed to load comments');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    if (onCommentCountChange) {
      onCommentCountChange(comments.length + 1);
    }
    toast.success('Comment added successfully');
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    if (onCommentCountChange) {
      onCommentCountChange(comments.length - 1);
    }
    toast.success('Comment deleted successfully');
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => prev.map(c => 
      c.id === updatedComment.id ? updatedComment : c
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-700 rounded-lg mb-4"></div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error mx-auto mb-2" />
        <Text color="muted" className="mb-3">
          {error}
        </Text>
        <button
          onClick={loadComments}
          className="text-primary hover:text-accent transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      
      {comments.length === 0 ? (
        <div className="text-center py-6">
          <ApperIcon name="MessageCircle" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <Text color="muted">
            No comments yet. Be the first to comment!
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          <Text variant="caption" color="muted" className="flex items-center">
            <ApperIcon name="MessageCircle" size={16} className="mr-2" />
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Text>
          
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CommentItem
                comment={comment}
                onDeleted={handleCommentDeleted}
                onUpdated={handleCommentUpdated}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;