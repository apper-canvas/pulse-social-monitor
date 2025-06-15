import notificationData from '../mockData/notifications.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationService {
  constructor() {
    this.notifications = [...notificationData];
  }

  async getAll() {
    await delay(300);
    return [...this.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await delay(200);
    const notification = this.notifications.find(n => n.id === id);
    return notification ? { ...notification } : null;
  }

  async getByUserId(userId) {
    await delay(300);
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(notification => ({ ...notification }));
  }

  async getUnreadCount(userId) {
    await delay(200);
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  async create(notificationData) {
    await delay(250);
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notificationData
    };
    this.notifications.unshift(newNotification);
    return { ...newNotification };
  }

  async markAsRead(id) {
    await delay(200);
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return { ...notification };
    }
    return null;
  }

  async markAllAsRead(userId) {
    await delay(300);
    this.notifications.forEach(notification => {
      if (notification.userId === userId) {
        notification.read = true;
      }
    });
    return true;
  }

  async delete(id) {
    await delay(300);
    const notificationIndex = this.notifications.findIndex(n => n.id === id);
    if (notificationIndex !== -1) {
      this.notifications.splice(notificationIndex, 1);
      return true;
    }
    return false;
  }
}

export default new NotificationService();