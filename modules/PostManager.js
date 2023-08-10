const Post = require("./Post.js");

module.exports = class PostManager {
  constructor(db) {
    this._posts = null;
    this._db = db;
  }

  async getPosts() {
    if (!this._posts) this._posts = (await this._db.get("posts") ?? []).map(post => Post.fromJson(post));
    return this._posts;
  }

  async getPostById(id) {
    return (await this.getPosts()).find(
      post => post.id === id
    ) ?? null;
  }
  
  async savePost(post) {
    if (!post instanceof Post) throw new Error("Parameter post must be an instance of Post");

    const posts = await this.getPosts();

    if (!posts.includes(post)) {
      const index = posts.findIndex(p => p.id === post.id);
      if (index === -1) posts.push(post);
      else posts.splice(index, 1, post);
    }
    
    this._posts = posts;
    await this._db.set("posts", posts.map(p => p.toJson()));

    return post;
  }

  async deletePost(delPost) {
    if (!delPost instanceof Post) throw new Error("Parameter post must be an instance of Post");

    const posts = await this.getPosts();
    const post = posts.includes(delPost) ? delPost : posts.find(p => p.id === delPost.id);
    if (!post) throw new Error("Post does not exist");

    posts.splice(posts.indexOf(post), 1);
    await this._db.set("posts", posts.map(p => p.toJson()));

    return posts;
  }

  async getNextId() {
    const posts = await this.getPosts();
    return (posts[posts.length-1]?.id ?? 0) + 1;
  }
}