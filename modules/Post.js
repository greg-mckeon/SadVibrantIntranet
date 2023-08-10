module.exports = class Post {
  constructor(authorId, id, title, url, content, createdAt, comments, upvotes, downvotes, nextCommentId) {
    this.author = authorId;
    this.id = id;
    this.title = title;
    this.url = url;
    this.content = content;
    this.createdAt = createdAt;
    this.comments = comments ?? [];
    this.upvotes = upvotes ?? [];
    this.downvotes = downvotes ?? [];
    this.nextCommentId = nextCommentId ?? 1;
    this.external = Boolean(this.url);
  }

  addComment(comment, authorId, createdAt) {
    this.comments.push({ id: this.nextCommentId, comment, author: authorId, createdAt });
    this.nextCommentId++;
  }

  toJson() {
    return {
      author: this.author,
      id: this.id,
      title: this.title,
      url: this.url,
      content: this.content,
      createdAt: this.createdAt,
      comments: this.comments,
      upvotes: this.upvotes,
      downvotes: this.downvotes,
      nextCommentId: this.nextCommentId
    };
  }
  
  static fromJson(json) {
    return new Post(json.author, json.id, json.title, json.url, json.content, json.createdAt, json.comments, json.upvotes, json.downvotes, json.nextCommentId);
  }
}