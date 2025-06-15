import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import PostCard from '../molecules/PostCard';
import ApperIcon from '../ApperIcon';
import { userService, postService } from '@/services';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        let userData;
        if (username) {
          userData = await userService.getByUsername(username);
        } else {
          userData = await userService.getCurrentUser();
        }
        
        if (!userData) {
          setError('User not found');
          return;
        }
        
        setUser(userData);
        
        // Load user's posts
        setPostsLoading(true);
        const userPosts = await postService.getByUserId(userData.id);
        setPosts(userPosts);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!user || followLoading) return;
    
    setFollowLoading(true);
    try {
      const newFollowState = !isFollowing;
      
      // Optimistic update
      setIsFollowing(newFollowState);
      
      if (newFollowState) {
        const updatedUser = await userService.followUser(user.id);
        setUser(updatedUser);
        toast.success(`Following ${user.displayName}`);
      } else {
        const updatedUser = await userService.unfollowUser(user.id);
        setUser(updatedUser);
        toast.success(`Unfollowed ${user.displayName}`);
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(!isFollowing);
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
<div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="glass rounded-xl p-8 animate-pulse">
            <div className="flex items-center space-x-6 mb-6">
<div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
<div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="flex space-x-8">
<div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
<div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-8"
          >
            <ApperIcon name="UserX" className="w-16 h-16 text-error mx-auto mb-4" />
<Text variant="subheading" className="text-gray-900 mb-2">
              {error}
            </Text>
            <Text color="muted">
              The user you're looking for doesn't exist or has been removed.
            </Text>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
<div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <Avatar src={user.avatar} alt={user.displayName} size="2xl" />
              <div className="flex-1">
<Text variant="heading" size="xl" className="text-gray-900 mb-1">
                  {user.displayName}
                </Text>
                <Text color="muted" className="mb-3">
                  @{user.username}
                </Text>
                {user.bio && (
<Text className="text-gray-900 leading-relaxed break-words">
                    {user.bio}
                  </Text>
                )}
              </div>
            </div>
            
            {username && (
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                onClick={handleFollow}
                loading={followLoading}
                icon={isFollowing ? 'UserMinus' : 'UserPlus'}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
<Text variant="label" className="text-gray-900">
                {user.postsCount}
              </Text>
              <Text color="muted">
                Posts
              </Text>
            </div>
            <div className="flex items-center space-x-2">
<Text variant="label" className="text-gray-900">
                {user.followersCount}
              </Text>
              <Text color="muted">
                Followers
              </Text>
            </div>
            <div className="flex items-center space-x-2">
<Text variant="label" className="text-gray-900">
                {user.followingCount}
              </Text>
              <Text color="muted">
                Following
              </Text>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
<Text variant="subheading" className="text-gray-900 mb-6">
            Posts
          </Text>
          
          {postsLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
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
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
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
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-xl p-8"
              >
                <ApperIcon name="FileText" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
<Text variant="subheading" className="text-gray-900 mb-2">
                  No posts yet
                </Text>
                <Text color="muted">
                  {username ? `${user.displayName} hasn't posted anything yet` : "You haven't posted anything yet"}
                </Text>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;