import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Input from '../atoms/Input';
import ApperIcon from '../ApperIcon';
import { messageService, userService } from '@/services';
import { toast } from 'react-toastify';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [currentUserData, conversationsList, allUsers] = await Promise.all([
          userService.getCurrentUser(),
          messageService.getConversationsList('1'), // Current user ID
          userService.getAll()
        ]);
        
        setCurrentUser(currentUserData);
        setConversations(conversationsList);
        
        // Create users lookup
        const usersMap = {};
        allUsers.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadConversation = async (otherUserId) => {
    try {
      const conversationMessages = await messageService.getConversation('1', otherUserId);
      setMessages(conversationMessages);
      setSelectedConversation(otherUserId);
      
      // Mark as read
      await messageService.markConversationAsRead('1', otherUserId);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendLoading) return;

    setSendLoading(true);
    try {
      const message = await messageService.create({
        senderId: '1',
        receiverId: selectedConversation,
        content: newMessage.trim()
      });

      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update conversations list
      const updatedConversations = await messageService.getConversationsList('1');
      setConversations(updatedConversations);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendLoading(false);
    }
  };

  if (loading) {
    return (
<div className="h-screen bg-white flex">
<div className="w-1/3 border-r border-gray-200 p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
<div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
<div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
<div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
<div className="h-screen bg-white flex overflow-hidden">
      {/* Conversations List */}
<div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Text variant="heading" size="lg" className="text-gray-900">
            Messages
          </Text>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Text color="muted">No conversations yet</Text>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => {
                const otherUserId = conversation.senderId === '1' ? conversation.receiverId : conversation.senderId;
                const otherUser = users[otherUserId];
                
                if (!otherUser) return null;
                
                return (
                  <motion.button
                    key={otherUserId}
whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                    onClick={() => loadConversation(otherUserId)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
selectedConversation === otherUserId ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar src={otherUser.avatar} alt={otherUser.displayName} />
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
<Text variant="label" className="text-gray-900 truncate">
                          {otherUser.displayName}
                        </Text>
                        <Text variant="caption" color="muted">
                          {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                        </Text>
                      </div>
                      <Text variant="caption" color="muted" className="truncate">
                        {conversation.content}
                      </Text>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
<div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <Avatar 
                src={users[selectedConversation]?.avatar} 
                alt={users[selectedConversation]?.displayName} 
              />
              <div>
<Text variant="label" className="text-gray-900">
                  {users[selectedConversation]?.displayName}
                </Text>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <Text variant="caption" color="muted">
                    Online
                  </Text>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === '1';
                const user = users[message.senderId];
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {!isOwnMessage && (
                        <Avatar src={user?.avatar} alt={user?.displayName} size="sm" />
                      )}
                      <div className={`px-4 py-2 rounded-2xl break-words ${
                        isOwnMessage 
? 'bg-gradient-to-r from-primary to-accent text-white' 
                          : 'bg-surface text-gray-900'
                      }`}>
                        <Text size="sm">{message.content}</Text>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Message Input */}
<form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="rounded-full"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={sendLoading}
                  disabled={!newMessage.trim()}
                  className="rounded-full px-6"
                >
                  <ApperIcon name="Send" size={16} />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="MessageSquare" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
<Text variant="subheading" className="text-gray-900 mb-2">
                Select a conversation
              </Text>
              <Text color="muted">
                Choose a conversation to start messaging
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;