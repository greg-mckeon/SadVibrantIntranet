const { posts } = require("../modules/managers.js");

module.exports = async function createAccount(req, res) {
  const id = Number(req.params.id);
  const post = await posts.getPostById(id);

  const errors = [];

  if (!req.loggedIn) errors.push("You are not logged in");
  else if (!req.account.admin) errors.push("You are not an admin");
  else if (!post) errors.push("Post does not exist");
  
  if (errors.length >= 1) {
    res.send({ success: false, errors });
  } else {
    await posts.deletePost(post);

    res.send({ success: true, message: "Successfully deleted post" });
  }
}