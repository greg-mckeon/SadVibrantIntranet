const { posts } = require("../modules/managers.js");

module.exports = async function createAccount(req, res) {
  const comment = typeof req.body.comment === "string" ? req.body.comment : "";

  const id = Number(req.params.id);
  const post = await posts.getPostById(id);

  const errors = [];

  if (!req.loggedIn) errors.push("You are not logged in");
  else if (!post) errors.push("Post does not exist");
  else if (comment.length === 0 || comment.length > 1000) errors.push("Comment must be 1-1000 characters");
  
  if (errors.length >= 1) {
    res.send({ success: false, errors });
  } else {
    const account = req.account;
    
    post.addComment(comment, account.id, Date.now());
    
    await posts.savePost(post);

    res.send({ success: true, message: "Successfully posted comment" });
  }
}