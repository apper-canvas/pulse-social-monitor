import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import ApperIcon from '../ApperIcon';
import { notificationService, userService, postService, messageService } from '@/services';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [entityData, setEntityData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notificationsList, allUsers] = await Promise.all([
          notificationService.getByUserId('1'), // Current user ID
          userService.getAll()
        ]);
        
        setNotifications(notificationsList);
        
        // Create users lookup
        const usersMap = {};
        allUsers.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
};

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Set selected notification and show detail modal
    setSelectedNotification(notification);
    setShowDetailModal(true);
    setDetailLoading(true);
    setEntityData(null);
    
    // Load entity data based on notification type
    try {
      let data = null;
      switch (notification.type) {
        case 'like':
        case 'comment':
          if (notification.entityId) {
            data = await postService.getById(notification.entityId);
          }
          break;
        case 'message':
          if (notification.entityId) {
            data = await messageService.getById(notification.entityId);
          }
          break;
        case 'follow':
          // For follow notifications, entityId represents the followed user
          if (notification.entityId) {
            data = await userService.getById(notification.entityId);
          }
          break;
      }
      setEntityData(data);
    } catch (error) {
      console.error('Failed to load entity data:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead('1');
      setNotifications(notifications.map(notification => 
        ({ ...notification, read: true })
      ));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const navigateToEntity = () => {
    if (!selectedNotification) return;
    
    setShowDetailModal(false);
    
    switch (selectedNotification.type) {
      case 'like':
      case 'comment':
        if (selectedNotification.entityId) {
          navigate(`/post/${selectedNotification.entityId}`);
        }
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'follow':
        if (users[selectedNotification.actorId]) {
          navigate(`/profile/${users[selectedNotification.actorId].username}`);
        }
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'Heart', color: 'text-accent' };
      case 'comment':
        return { name: 'MessageCircle', color: 'text-secondary' };
      case 'follow':
        return { name: 'UserPlus', color: 'text-primary' };
      case 'message':
        return { name: 'Mail', color: 'text-info' };
      default:
        return { name: 'Bell', color: 'text-gray-400' };
    }
  };

  const getNotificationText = (notification) => {
    const actor = users[notification.actorId];
    if (!actor) return '';

    switch (notification.type) {
      case 'like':
        return `${actor.displayName} liked your post`;
      case 'comment':
        return `${actor.displayName} commented on your post`;
      case 'follow':
        return `${actor.displayName} started following you`;
      case 'message':
        return `${actor.displayName} sent you a message`;
      default:
        return 'New notification';
    }
  };

  if (loading) {
    return (
<div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
<div key={i} className="glass rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
<div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
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
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
<Text variant="subheading" className="text-gray-900 mb-2">
              Something went wrong
            </Text>
            <Text color="muted" className="mb-4">
              {error}
            </Text>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Text variant="heading" size="2xl" className="gradient-text mb-2">
              Notifications
            </Text>
            <Text color="muted">
              Stay updated with your latest activity
            </Text>
          </div>
          
          {notifications.some(n => !n.read) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              icon="CheckCheck"
            >
              Mark all read
            </Button>
          )}
        </motion.div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
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
                <ApperIcon name="Bell" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
<Text variant="subheading" className="text-gray-900 mb-2">
                No notifications yet
              </Text>
              <Text color="muted">
                When you get notifications, they'll show up here
              </Text>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const actor = users[notification.actorId];
              const icon = getNotificationIcon(notification.type);
              
              if (!actor) return null;
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
className={`glass rounded-xl p-4 hover:bg-gray-800/50 transition-all cursor-pointer ${
                    !notification.read ? 'border-l-4 border-primary' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar src={actor.avatar} alt={actor.displayName} />
<div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center ${icon.color}`}>
                        <ApperIcon name={icon.name} size={12} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
<Text className="text-gray-900 break-words">
                        {getNotificationText(notification)}
                      </Text>
                      <Text variant="caption" color="muted">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Text>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
)}
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Text variant="subheading" className="text-gray-900">
                  Notification Details
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowDetailModal(false)}
                />
              </div>

              {/* Notification Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Avatar 
                    src={users[selectedNotification.actorId]?.avatar} 
                    alt={users[selectedNotification.actorId]?.displayName} 
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center ${getNotificationIcon(selectedNotification.type).color}`}>
                    <ApperIcon name={getNotificationIcon(selectedNotification.type).name} size={12} />
                  </div>
                </div>
                <div className="flex-1">
                  <Text className="text-gray-900">
                    {getNotificationText(selectedNotification)}
                  </Text>
                  <Text variant="caption" color="muted">
                    {formatDistanceToNow(new Date(selectedNotification.createdAt), { addSuffix: true })}
                  </Text>
                </div>
              </div>

              {/* Entity Preview */}
              {detailLoading ? (
                <div className="glass rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : entityData ? (
                <div className="glass rounded-lg p-4 mb-4">
                  <Text variant="caption" color="muted" className="mb-2">
                    {selectedNotification.type === 'like' && 'Post that was liked:'}
                    {selectedNotification.type === 'comment' && 'Post that was commented on:'}
                    {selectedNotification.type === 'message' && 'Message preview:'}
                    {selectedNotification.type === 'follow' && 'User profile:'}
                  </Text>
                  
                  {(selectedNotification.type === 'like' || selectedNotification.type === 'comment') && (
                    <div>
                      <Text className="text-gray-900 line-clamp-3">
                        {entityData.content}
                      </Text>
                      {entityData.mediaUrls && entityData.mediaUrls.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                          {entityData.mediaUrls.slice(0, 2).map((url, idx) => (
                            <div key={idx} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ApperIcon name="Image" size={16} className="text-gray-400" />
                            </div>
                          ))}
                          {entityData.mediaUrls.length > 2 && (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Text variant="caption" className="text-gray-600">
                                +{entityData.mediaUrls.length - 2}
                              </Text>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedNotification.type === 'message' && (
                    <Text className="text-gray-900 line-clamp-2">
                      {entityData.content}
                    </Text>
                  )}
                  
                  {selectedNotification.type === 'follow' && (
                    <div className="flex items-center space-x-3">
                      <Avatar src={entityData.avatar} alt={entityData.displayName} size="sm" />
                      <div>
                        <Text className="text-gray-900 font-medium">
                          {entityData.displayName}
                        </Text>
                        <Text variant="caption" color="muted">
                          @{entityData.username}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass rounded-lg p-4 mb-4 text-center">
                  <ApperIcon name="AlertCircle" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Text variant="caption" color="muted">
                    Unable to load content preview
                  </Text>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={navigateToEntity}
                  icon={
                    selectedNotification.type === 'follow' ? 'User' :
                    selectedNotification.type === 'message' ? 'MessageCircle' : 'Eye'
                  }
                >
                  {selectedNotification.type === 'follow' && 'View Profile'}
                  {selectedNotification.type === 'message' && 'Open Messages'}
                  {(selectedNotification.type === 'like' || selectedNotification.type === 'comment') && 'View Post'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;