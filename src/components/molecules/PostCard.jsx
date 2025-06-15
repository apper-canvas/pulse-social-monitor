import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/Text';
import { postService, userService } from '@/services';

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getById(post.userId);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, [post.userId]);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newLikedState = !isLiked;
      const newCount = newLikedState ? likesCount + 1 : likesCount - 1;
      
      // Optimistic update
      setIsLiked(newLikedState);
      setLikesCount(newCount);
      
      if (newLikedState) {
        await postService.likePost(post.id);
      } else {
        await postService.unlikePost(post.id);
      }
      
      if (onUpdate) {
        onUpdate({ ...post, likeCount: newCount });
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(likesCount);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

const handleShare = async () => {
    const shareData = {
      title: `${user?.displayName || 'User'}'s post`,
      text: post.content,
      url: window.location.href
    };

    // Try native share first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Post shared successfully');
        return;
      } catch (error) {
        // Handle user cancellation silently, handle other errors
        if (error.name !== 'AbortError') {
          console.warn('Share failed:', error);
          // Fall through to clipboard fallback
        } else {
          return; // User cancelled, don't show error
        }
      }
    }

    // Fallback to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      } else {
        // Final fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Unable to share or copy link. Please copy the URL manually.');
    }
  };

  if (!user) {
    return (
      <div className="glass rounded-xl p-6 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar src={user.avatar} alt={user.displayName} />
          <div>
            <Text variant="label" className="text-white">
              {user.displayName}
            </Text>
            <Text variant="caption" color="muted">
              @{user.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Text>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-white transition-colors">
          <ApperIcon name="MoreHorizontal" size={20} />
        </button>
      </div>

{/* Content */}
      <div className="mb-4">
        <div 
          className="text-white leading-relaxed break-words prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: post.content?.replace(
              /#(\w+)/g, 
              '<span class="text-accent font-semibold cursor-pointer hover:underline">#$1</span>'
            ) || ''
          }}
        />
      </div>

      {/* Media */}
      {post.mediaUrl && post.mediaType === 'image' && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full h-auto max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-accent' : 'text-gray-400 hover:text-accent'
            }`}
            disabled={loading}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon 
                name={isLiked ? "Heart" : "Heart"} 
                size={20}
                fill={isLiked ? "currentColor" : "none"}
              />
            </motion.div>
            <span className="text-sm font-medium">{likesCount}</span>
          </motion.button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-secondary transition-colors"
          >
            <ApperIcon name="MessageCircle" size={20} />
            <span className="text-sm font-medium">{post.commentCount || 0}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Share" size={20} />
          </button>
        </div>

        <button className="text-gray-400 hover:text-white transition-colors">
          <ApperIcon name="Bookmark" size={20} />
        </button>
      </div>

      {/* Comments section placeholder */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <Text color="muted" className="text-center">
            Comments feature coming soon
          </Text>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;