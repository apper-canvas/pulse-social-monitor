import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import RichTextEditor from '../atoms/RichTextEditor';
import { commentService } from '@/services';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const newComment = await commentService.create({
        postId,
        userId: '1', // TODO: Get from auth context
        content: content.trim()
      });
      
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
      
      setContent('');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Write a comment..."
        className="min-h-[80px]"
        disabled={loading}
      />
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={loading}
          disabled={!content.trim() || loading}
        >
          {loading ? 'Posting...' : 'Comment'}
        </Button>
      </div>
    </motion.form>
  );
};

export default CommentForm;