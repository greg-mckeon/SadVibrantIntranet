const Post = require("../modules/Post.js");
const { posts } = require("../modules/managers.js");

module.exports = async function createAccount(req, res) {
  const title = typeof req.body.title === "string" ? req.body.title : "";
  const url = typeof req.body.url === "string" ? req.body.url : "";
  const content = typeof req.body.content === "string" ? req.body.content : "";

  const errors = [];

  if (!req.loggedIn) errors.push("You are not logged in");
  else {
    if (title.length < 5 || title.length > 100) errors.push("Title must be 5-100 characters");
    if (url && !url.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i)) errors.push("Invalid URL");
    if (content && content.length < 5 || content.length > 1000) errors.push("Content must be 5-1000 characters");
  }
  
  if (errors.length >= 1) res.render("writePost", { errors });
  else {
    const account = req.account;
    
    const post = Post.fromJson({
      author: account.id,
      id: await posts.getNextId(),
      title,
      url,
      content,
      createdAt: Date.now()
    });
    
    await posts.savePost(post);

    res.redirect(`/posts/${post.id}`);
  }
}