import commentData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.comments = [...commentData];
  }

  async getAll() {
    await delay(300);
    return [...this.comments];
  }

  async getById(id) {
    await delay(200);
    const comment = this.comments.find(c => c.id === id);
    return comment ? { ...comment } : null;
  }

  async getByPostId(postId) {
    await delay(300);
    return this.comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(comment => ({ ...comment }));
  }

  async create(commentData) {
    await delay(350);
    const newComment = {
      id: Date.now().toString(),
      likeCount: 0,
      createdAt: new Date().toISOString(),
      ...commentData
    };
    this.comments.unshift(newComment);
    return { ...newComment };
  }

  async update(id, data) {
    await delay(300);
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex !== -1) {
      this.comments[commentIndex] = { ...this.comments[commentIndex], ...data };
      return { ...this.comments[commentIndex] };
    }
    return null;
  }

  async delete(id) {
    await delay(300);
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex !== -1) {
      this.comments.splice(commentIndex, 1);
      return true;
    }
    return false;
  }

  async likeComment(id) {
    await delay(200);
    const comment = this.comments.find(c => c.id === id);
    if (comment) {
      comment.likeCount += 1;
      return { ...comment };
    }
    return null;
  }

  async unlikeComment(id) {
    await delay(200);
    const comment = this.comments.find(c => c.id === id);
    if (comment) {
      comment.likeCount = Math.max(0, comment.likeCount - 1);
      return { ...comment };
    }
    return null;
  }
}

export default new CommentService();