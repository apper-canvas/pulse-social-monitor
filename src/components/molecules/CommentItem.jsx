import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/Text';
import ApperIcon from '../ApperIcon';
import { commentService, userService } from '@/services';

const CommentItem = ({ comment, onDeleted, onUpdated }) => {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getById(comment.userId);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, [comment.userId]);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newLikedState = !isLiked;
      const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
      
      // Optimistic update
      setIsLiked(newLikedState);
      setLikeCount(newCount);
      
      const updatedComment = newLikedState 
        ? await commentService.likeComment(comment.id)
        : await commentService.unlikeComment(comment.id);
      
      if (onUpdated) {
        onUpdated(updatedComment);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setLoading(true);
    try {
      await commentService.delete(comment.id);
      if (onDeleted) {
        onDeleted(comment.id);
      }
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!user) {
    return (
      <div className="flex space-x-3 animate-pulse">
        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Check if current user owns this comment (simplified - in real app would use auth context)
  const isOwner = comment.userId === '1'; // TODO: Get from auth context

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex space-x-3 group"
    >
      <Avatar src={user.avatar} alt={user.displayName} size="sm" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <Text variant="caption" className="text-white font-medium">
            {user.displayName}
          </Text>
          <Text variant="caption" color="muted">
            @{user.username}
          </Text>
          <Text variant="caption" color="muted">
            •
          </Text>
          <Text variant="caption" color="muted">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </Text>
        </div>
        
        <div 
          className="text-gray-200 text-sm leading-relaxed break-words prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: comment.content?.replace(
              /#(\w+)/g, 
              '<span class="text-accent font-semibold cursor-pointer hover:underline">#$1</span>'
            ) || ''
          }}
        />
        
        <div className="flex items-center space-x-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              isLiked ? 'text-accent' : 'text-gray-400 hover:text-accent'
            }`}
            disabled={loading}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon 
                name="Heart" 
                size={14}
                fill={isLiked ? "currentColor" : "none"}
              />
            </motion.div>
            {likeCount > 0 && <span>{likeCount}</span>}
          </motion.button>
          
          {isOwner && (
            <div className="flex items-center space-x-2">
              {!showDeleteConfirm ? (
                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                  disabled={loading}
                >
                  <ApperIcon name="Trash2" size={14} />
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDelete}
                    className="text-error hover:text-red-400 text-xs"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Confirm'}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="text-gray-400 hover:text-white text-xs"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;