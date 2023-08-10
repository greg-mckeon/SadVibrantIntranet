const Post = require("../modules/Post.js");
const { posts } = require("../modules/managers.js");

module.exports = async function createAccount(req, res) {
  const id = Number(req.params.id);
  const post = await posts.getPostById(id);

  const errors = [];

  const account = req.account;
  
  if (!req.loggedIn) errors.push("You are not logged in");
  else if (!post) errors.push("Post does not exist");
  
  if (errors.length >= 1) {
    res.send({ success: false, errors });
  } else {
    post.downvotes = post.downvotes.filter(u => u.user !== account.id);
    
    if (post.upvotes.some(u => u.user === account.id)) {
      post.upvotes = post.upvotes.filter(u => u.user !== account.id);
      await posts.savePost(post);
      res.send({ success: true, message: "Removed upvote from post" });
    } else {
      post.upvotes.push({ user: account.id, timestamp: Date.now() });
      await posts.savePost(post);
      res.send({ success: true, message: "Added upvote to post" });
    }
  }
}