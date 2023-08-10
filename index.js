const express = require("express");
const app = express();

const session = require("express-session");
const { create } = require("express-handlebars");

const getRedirectTo = require("./modules/getRedirectTo.js");
const getMappedPosts = require("./modules/getMappedPosts.js");
const getVoteWeights = require("./modules/getVoteWeights.js");

const { accounts, posts } = require("./modules/managers.js");

const signUp = require("./routes/signUp.js");
const logIn = require("./routes/logIn.js");
const logOut = require("./routes/logOut.js");
const writePost = require("./routes/writePost.js");
const postComment = require("./routes/postComment.js");
const upvotePost = require("./routes/upvotePost.js");
const downvotePost = require("./routes/downvotePost.js");
const deletePost = require("./routes/deletePost.js");
const deleteComment = require("./routes/deleteComment.js");

(async () => {
  if (process.env.ADD_ADMIN) {
    const account = await accounts.getAccountByUsername(process.env.ADD_ADMIN);
    
    if (!account) throw new Error("Account does not exist");
    if (account.admin) throw new Error("Account already has admin");
    
    account.admin = true;
    await accounts.saveAccount(account);

    console.log("Successfully added admin");
  }
  
  if (process.env.REMOVE_ADMIN) {
    const account = await accounts.getAccountByUsername(process.env.ADD_ADMIN);
    
    if (!account) throw new Error("Account does not exist");
    if (!account.admin) throw new Error("Account already does not have admin");
    
    account.admin = false;
    await accounts.saveAccount(account);

    console.log("Successfully removed admin");
  }
})();

app.use(express.json());

app.set("trust proxy", true);
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { secure: true },
  resave: false,
  saveUninitialized: false
}));

app.use(async (req, res, next) => {
  const
    account = await accounts.getAccountById(req.session.account),
    loggedIn = Boolean(account);

  req.loggedIn = loggedIn;
  req.account = account;
  
  res.locals.loggedIn = loggedIn;
  res.locals.account = account;

  next();
});

const hbs = create({
  helpers: {
    formatDate(stamp) { return new Date(stamp).toLocaleString(); },
    length(array) { return array.length; },
    endS(num) { return num === 1 ? "" : "s"; },
    lowercase(str) { return str.toLowerCase(); }
  },
  extname: ".html"
});

app.engine("html", hbs.engine);
app.set("view engine", "html");

app.use(express.urlencoded({ extended: false }));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", (req, res) => res.redirect("/posts/top"));

const sections = [ "Top", "New" ];

app.get("/posts/top", async (req, res) => {
  let mappedPosts = await getMappedPosts(req.account);
  
  for (const mappedPost of mappedPosts) {
    let score = 0;
    score += getVoteWeights(mappedPost.upvotes);
    score -= getVoteWeights(mappedPost.downvotes);
    mappedPost.score = score;
  }

  mappedPosts = mappedPosts
    .filter(post => post.score >= 2)
    .sort((a, b) => b.score - a.score);

  const section = "Top";
  
  res.render("posts", {
    posts: mappedPosts,
    section,
    sections: sections.map(s => ({ name: s, current: s === section }))
  });
});

app.get("/posts/new", async (req, res) => {
  const mappedPosts = await getMappedPosts(req.account);

  const section = "New";
  
  res.render("posts", {
    posts: mappedPosts, section: "New",
    section,
    sections: sections.map(s => ({ name: s, current: s === section }))
  });
});

app.get("/signUp", (req, res) => {
  if (req.loggedIn) return res.redirect("/");
  const redirect = getRedirectTo(req);
  res.render("signUp", { redirect: redirect ? encodeURIComponent(redirect) : redirect });
});

app.get("/logIn", (req, res) => {
  if (req.loggedIn) return res.redirect("/");
  const redirect = getRedirectTo(req);
  res.render("logIn", { redirect: redirect ? encodeURIComponent(redirect) : redirect });
});

app.get("/writePost", (req, res) => {
  if (!req.loggedIn) return res.redirect("/");
  res.render("writePost");
});

app.get("/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  let post = await posts.getPostById(id);
  if (!post) return res.redirect("/");

  let backTo = getRedirectTo(req);
  if (backTo) backTo = new URL(backTo).pathname;
  if (
    !backTo ||
    !sections.some(s => backTo.toLowerCase() === `/posts/${s.toLowerCase()}`)
  )
    backTo = null;
  
  let comments = [];

  for (const comment of post.comments) {
    comments.push({ ...comment, authorName: (await accounts.getAccountById(comment.author)).username });
  }
  
  res.render("post", {
    post,
    authorName: (await accounts.getAccountById(post.author)).username, comments,
    upvoted: req.loggedIn && post.upvotes.some(up => up.user === req.account.id),
    downvoted: req.loggedIn && post.downvotes.some(up => up.user === req.account.id),
    backTo
  });
});

app.post("/signUp", signUp);

app.post("/logIn", logIn);

app.post("/logOut", logOut);

app.post("/writePost", writePost);

app.post("/posts/:id/comment", postComment);

app.post("/posts/:id/upvote", upvotePost);

app.post("/posts/:id/downvote", downvotePost);

app.post("/posts/:id/delete", deletePost);

app.post("/posts/:postId/comments/:commentId/delete", deleteComment);

const listener = app.listen(process.env.PORT, () => console.log(`App listening on port ${listener.address().port}`));