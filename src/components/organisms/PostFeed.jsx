import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../molecules/PostCard';
import Text from '../atoms/Text';
import ApperIcon from '../ApperIcon';
import { postService } from '@/services';

const PostFeed = ({ variant = 'home' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (variant === 'trending') {
          result = await postService.getTrending();
        } else {
          result = await postService.getAll();
        }
        setPosts(result);
      } catch (err) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [variant]);

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center space-x-3 mb-4">
<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
<div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-3">
<div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8"
        >
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
<Text variant="subheading" className="text-gray-900 mb-2">
            Oops! Something went wrong
          </Text>
          <Text color="muted" className="mb-4">
            {error}
          </Text>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:text-accent transition-colors"
          >
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-xl p-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MessageSquare" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          </motion.div>
<Text variant="subheading" className="text-gray-900 mb-2">
            No posts yet
          </Text>
          <Text color="muted" className="mb-4">
            {variant === 'trending' 
              ? 'No trending posts at the moment'
              : 'Follow some users to see their posts in your feed'
            }
          </Text>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard post={post} onUpdate={handlePostUpdate} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostFeed;