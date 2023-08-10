const accountInfo = document.querySelector(".accountInfo");

if (accountInfo) {
  const accountDropdown = document.querySelector(".accountDropdown");
  document.addEventListener("click", (e) => {
    if (!accountDropdown.contains(e.target) && document.activeElement === accountInfo)
      accountInfo.blur();
  });
  accountInfo.addEventListener("focus", (e) => {
    accountInfo.classList.add("forceOpen");
    
    accountInfo.addEventListener("focusout", focusOut);

    function focusOut(e) {
      console.log(e.relatedTarget)
      if (!accountInfo.contains(e.relatedTarget)) {
        accountInfo.removeEventListener("focusout", focusOut);
        accountInfo.classList.remove("forceOpen");
      }
    }
  });
}


const createNew = document.querySelector(".createNew");

if (createNew) {
  createNew.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/writePost";
  });
}

const changeDates = document.querySelectorAll(".listPostCreatedStamp");

for (const change of changeDates) {
  change.innerText = new Date(Number(change.dataset.stamp)).toLocaleString();
}


const commentButton = document.querySelector(".commentButton");

if (commentButton) {
  commentButton.addEventListener("click", (e) => {
    const commentForm = document.createElement("form");
    
    const commentText = document.createElement("textarea");
    commentText.classList.add("commentTextarea");
    commentText.classList.add("styledTextarea");
    commentText.rows = 4;
    commentText.autocomplete = "off";
    commentText.required = true;
    commentText.maxLength = "1000";

    const commentPostButton = document.createElement("input");
    commentPostButton.classList.add("commentPostButton");
    commentPostButton.classList.add("styledButton");
    commentPostButton.type = "submit";
    commentPostButton.value = "Post Comment";
    
    commentForm.append(commentText, commentPostButton);

    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      commentText.disabled = true;
      commentPostButton.disabled = true;
      
      fetch(`${window.location.pathname}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment: commentText.value })
      })
        .then(res => res.json())
        .then(res => {
          commentText.disabled = false;
          commentPostButton.disabled = false;

          if (res.success) window.location.reload();
          else {
            for (const error of (res.errors || []).reverse()) {
              const errorP = document.createElement("p");
              errorP.classList.add("error");
              errorP.innerHTML = error;
              commentForm.before(errorP);
            }
          }
        });
    });
    
    commentButton.replaceWith(commentForm);
  });
}


const upvoteButtons = document.querySelectorAll(".upvoteButton");
const downvoteButtons = document.querySelectorAll(".downvoteButton");

voteClickListener(upvoteButtons, downvoteButtons, "upvote");
voteClickListener(downvoteButtons, upvoteButtons, "downvote");

function voteClickListener(voteButtons, otherButtons, voteType) {
  for (const voteButton of voteButtons) {
    voteButton.addEventListener("click", () => {
      const postId = voteButton.dataset.post;
      
      voteButton.disabled = true;

      for (const otherButton of otherButtons) {
        if (otherButton.dataset.post === postId)
          otherButton.disabled = true;
      }
      
      fetch(`/posts/${postId}/${voteType}`, {
        method: "POST"
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) voteButton.classList.toggle("selected");

          for (const otherButton of otherButtons) {
            if (otherButton.dataset.post === postId)
              otherButton.classList.remove("selected");
            otherButton.disabled = false;
          }
          
          voteButton.disabled = false;
        });
    });
  }
}


const deletePostButtons = document.querySelectorAll(".deletePostButton");

for (const deletePostButton of deletePostButtons) {
  deletePostButton.addEventListener("click", (e) => {
    const doDelete = confirm("Are you sure you want to delete this post?");

    if (doDelete) {
      const postId = deletePostButton.dataset.postId;

      fetch(`/posts/${postId}/delete`, {
        method: "POST"
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) window.location.reload();
          else alert(res.errors.join("\n"));
        });
    }
  });
}


const deleteCommentButtons = document.querySelectorAll(".deleteCommentButton");

for (const deleteCommentButton of deleteCommentButtons) {
  deleteCommentButton.addEventListener("click", (e) => {
    const doDelete = confirm("Are you sure you want to delete this comment?");
    
    if (doDelete) {
      const postId = deleteCommentButton.parentElement.parentElement.dataset.postId;
      const commentId = deleteCommentButton.parentElement.parentElement.dataset.commentId;
      
      fetch(`/posts/${postId}/comments/${commentId}/delete`, {
        method: "POST"
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) window.location.reload();
          else alert(res.errors.join("\n"));
        });
    }
  });
}