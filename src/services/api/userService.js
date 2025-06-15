import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...userData];
    this.currentUser = this.users[0]; // Simulate logged in user
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async getByUsername(username) {
    await delay(200);
    const user = this.users.find(u => u.username === username);
    return user ? { ...user } : null;
  }

  async getCurrentUser() {
    await delay(100);
    return { ...this.currentUser };
  }

  async followUser(userId) {
    await delay(300);
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.followersCount += 1;
      this.currentUser.followingCount += 1;
    }
    return { ...user };
  }

  async unfollowUser(userId) {
    await delay(300);
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.followersCount = Math.max(0, user.followersCount - 1);
      this.currentUser.followingCount = Math.max(0, this.currentUser.followingCount - 1);
    }
    return { ...user };
  }

  async searchUsers(query) {
    await delay(200);
    if (!query.trim()) return [];
    
    return this.users
      .filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10)
      .map(user => ({ ...user }));
  }

  async update(id, data) {
    await delay(300);
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...data };
      if (this.currentUser.id === id) {
        this.currentUser = { ...this.users[userIndex] };
      }
      return { ...this.users[userIndex] };
    }
    return null;
  }
}

export default new UserService();