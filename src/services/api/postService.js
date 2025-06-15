import postData from '../mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.posts = [...postData];
  }

  async getAll() {
    await delay(400);
    return [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await delay(200);
    const post = this.posts.find(p => p.id === id);
    return post ? { ...post } : null;
  }

  async getByUserId(userId) {
    await delay(300);
    return this.posts
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(post => ({ ...post }));
  }

  async getTrending() {
    await delay(350);
    return [...this.posts]
      .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
      .slice(0, 20)
      .map(post => ({ ...post }));
  }

  async create(postData) {
    await delay(400);
    const newPost = {
      id: Date.now().toString(),
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      ...postData
    };
    this.posts.unshift(newPost);
    return { ...newPost };
  }

  async update(id, data) {
    await delay(300);
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      this.posts[postIndex] = { ...this.posts[postIndex], ...data };
      return { ...this.posts[postIndex] };
    }
    return null;
  }

  async delete(id) {
    await delay(300);
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      this.posts.splice(postIndex, 1);
      return true;
    }
    return false;
  }

  async likePost(id) {
    await delay(200);
    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.likeCount += 1;
      return { ...post };
    }
    return null;
  }

  async unlikePost(id) {
    await delay(200);
const post = this.posts.find(p => p.id === id);
    if (post) {
      post.likeCount = Math.max(0, post.likeCount - 1);
      return { ...post };
    }
    return null;
  }

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    return this.posts
      .filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20)
      .map(post => ({ ...post }));
  }

  async incrementCommentCount(id) {
    await delay(200);
    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1;
      return { ...post };
    }
    return null;
  }

  async decrementCommentCount(id) {
    await delay(200);
    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
      return { ...post };
    }
    return null;
  }
}

export default new PostService();