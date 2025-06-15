import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { userService } from '@/services';

const UserCard = ({ user, onUpdate }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newFollowState = !isFollowing;
      
      // Optimistic update
      setIsFollowing(newFollowState);
      
      if (newFollowState) {
        const updatedUser = await userService.followUser(user.id);
        toast.success(`Following ${user.displayName}`);
        if (onUpdate) onUpdate(updatedUser);
      } else {
        const updatedUser = await userService.unfollowUser(user.id);
        toast.success(`Unfollowed ${user.displayName}`);
        if (onUpdate) onUpdate(updatedUser);
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(!isFollowing);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar src={user.avatar} alt={user.displayName} size="lg" />
          <div className="flex-1 min-w-0">
            <Text variant="label" className="text-white">
              {user.displayName}
            </Text>
            <Text variant="caption" color="muted" className="break-words">
              @{user.username}
            </Text>
            {user.bio && (
              <Text variant="caption" color="gray" className="mt-1 break-words">
                {user.bio}
              </Text>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Text variant="caption" color="white">
                  {user.followersCount}
                </Text>
                <Text variant="caption" color="muted">
                  followers
                </Text>
              </div>
              <div className="flex items-center space-x-1">
                <Text variant="caption" color="white">
                  {user.followingCount}
                </Text>
                <Text variant="caption" color="muted">
                  following
                </Text>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant={isFollowing ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleFollow}
          loading={loading}
          className="ml-4"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </motion.div>
  );
};

export default UserCard;