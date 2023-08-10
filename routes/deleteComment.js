const { posts } = require("../modules/managers.js");

module.exports = async function createAccount(req, res) {
  const postId = Number(req.params.postId);
  const post = await posts.getPostById(postId);

  const commentId = Number(req.params.commentId);
  const comment = post?.comments?.find(c => c.id === commentId);

  const errors = [];

  if (!req.loggedIn) errors.push("You are not logged in");
  else if (!req.account.admin) errors.push("You are not an admin");
  else if (!post) errors.push("Post does not exist");
  else if (!comment) errors.push("Comment does not exist");
  
  if (errors.length >= 1) {
    res.send({ success: false, errors });
  } else {
    post.comments.splice(post.comments.indexOf(comment), 1);
    
    await posts.savePost(post);

    res.send({ success: true, message: "Successfully deleted comment" });
  }
}