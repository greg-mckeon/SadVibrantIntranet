const { accounts, posts } = require("./managers.js");

module.exports = async function getMappedPosts(account) {
  const mappedPosts = JSON.parse(JSON.stringify((await posts.getPosts()))).sort((a, b) => b.createdAt - a.createdAt);

  for (const mappedPost of mappedPosts) {
    mappedPost.authorName = (await accounts.getAccountById(mappedPost.author)).username;
    mappedPost.upvoted = account && mappedPost.upvotes.some(up => up.user === account.id);
    mappedPost.downvoted = account && mappedPost.downvotes.some(up => up.user === account.id);
  }

  return mappedPosts;
}