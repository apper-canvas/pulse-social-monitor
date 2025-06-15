import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/Text';
import RichTextEditor from '../atoms/RichTextEditor';
import { postService, userService } from '@/services';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    loadCurrentUser();
  }, []);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strip HTML tags for plain text validation
    const plainTextContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (!plainTextContent) {
      toast.error('Please enter some content');
      return;
    }

    setLoading(true);
    try {
      // Simulate media upload if present
      let mediaUrl = '';
      if (mediaFile) {
        // In a real app, this would upload to a service like AWS S3
        mediaUrl = 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop';
      }

      const newPost = await postService.create({
        userId: currentUser?.id || '1',
        content: content, // Store HTML content with formatting
        mediaUrl,
        mediaType: mediaFile ? 'image' : ''
      });

      toast.success('Post created successfully!');
      
      // Reset form
      setContent('');
      setMediaFile(null);
      setMediaPreview('');
      onClose();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <Text variant="subheading" className="text-white">
                  Create Post
                </Text>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
<div className="flex items-start space-x-4 mb-4">
                  <Avatar 
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
                    alt={currentUser?.displayName || 'User'} 
                  />
                  <div className="flex-1">
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="What's happening? Use #hashtags for topics!"
                      maxLength={280}
                      className="w-full"
                    />
                    <div className="text-right mt-2">
                      <Text variant="caption" color="muted">
                        {content.replace(/<[^>]*>/g, '').length}/280
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="relative mb-4 rounded-lg overflow-hidden">
                    <img
                      src={mediaPreview}
                      alt="Media preview"
                      className="w-full h-auto max-h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                    >
                      <ApperIcon name="X" size={16} className="text-white" />
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <ApperIcon name="Image" size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <ApperIcon name="Smile" size={20} />
                    </button>
                  </div>

<Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={!content.replace(/<[^>]*>/g, '').trim()}
                  >
                    Post
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;