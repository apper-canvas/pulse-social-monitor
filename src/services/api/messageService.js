import messageData from '../mockData/messages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.messages = [...messageData];
  }

  async getAll() {
    await delay(300);
    return [...this.messages];
  }

  async getById(id) {
    await delay(200);
    const message = this.messages.find(m => m.id === id);
    return message ? { ...message } : null;
  }

  async getConversation(userId1, userId2) {
    await delay(300);
    return this.messages
      .filter(m => 
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(message => ({ ...message }));
  }

  async getConversationsList(userId) {
    await delay(300);
    const conversations = new Map();
    
    this.messages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (message.senderId === userId || message.receiverId === userId) {
        const existing = conversations.get(otherUserId);
        if (!existing || new Date(message.createdAt) > new Date(existing.createdAt)) {
          conversations.set(otherUserId, { ...message });
        }
      }
    });

    return Array.from(conversations.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async create(messageData) {
    await delay(200);
    const newMessage = {
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      ...messageData
    };
    this.messages.push(newMessage);
    return { ...newMessage };
  }

  async markAsRead(id) {
    await delay(200);
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.read = true;
      return { ...message };
    }
    return null;
  }

  async markConversationAsRead(userId1, userId2) {
    await delay(300);
    this.messages.forEach(message => {
      if ((message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)) {
        message.read = true;
      }
    });
    return true;
  }

  async delete(id) {
    await delay(300);
    const messageIndex = this.messages.findIndex(m => m.id === id);
    if (messageIndex !== -1) {
      this.messages.splice(messageIndex, 1);
      return true;
    }
    return false;
  }
}

export default new MessageService();