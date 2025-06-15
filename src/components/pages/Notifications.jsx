import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import ApperIcon from '../ApperIcon';
import { notificationService, userService } from '@/services';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});

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
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-8"
          >
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
            <Text variant="subheading" className="text-white mb-2">
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
    <div className="min-h-screen bg-background">
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
              <Text variant="subheading" className="text-white mb-2">
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
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar src={actor.avatar} alt={actor.displayName} />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-surface rounded-full flex items-center justify-center ${icon.color}`}>
                        <ApperIcon name={icon.name} size={12} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Text className="text-white break-words">
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
    </div>
  );
};

export default Notifications;