import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PostCard from '../molecules/PostCard';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import ApperIcon from '../ApperIcon';
import { postService } from '@/services';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('Post ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const postData = await postService.getById(id);
        if (!postData) {
          setError('Post not found');
        } else {
          setPost(postData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              icon="ArrowLeft" 
              onClick={handleBack}
              disabled
            >
              Back
            </Button>
          </div>
          <div className="glass rounded-xl p-6 animate-pulse">
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
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-4 flex space-x-4">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              icon="ArrowLeft" 
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-8 text-center"
            >
              <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
              <Text variant="subheading" className="text-gray-900 mb-2">
                {error === 'Post not found' ? 'Post not found' : 'Something went wrong'}
              </Text>
              <Text color="muted" className="mb-4">
                {error === 'Post not found' 
                  ? 'The post you\'re looking for doesn\'t exist or has been removed.'
                  : error
                }
              </Text>
              <div className="flex space-x-3 justify-center">
                <Button onClick={handleBack} variant="ghost">
                  Go Back
                </Button>
                {error !== 'Post not found' && (
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            icon="ArrowLeft" 
            onClick={handleBack}
          >
            Back
          </Button>
        </motion.div>

        {/* Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PostCard post={post} onUpdate={handlePostUpdate} />
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetail;