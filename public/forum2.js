const postsDiv = $("#posts");


$(document).ready(() => loadPosts());
$("#postForm").submit((e) => submitPost(e));
postsDiv.on("click", ".post__like", (e) => toggleLike(e));
postsDiv.on("click", ".post__dislike", (e) => toggleDislike(e));
postsDiv.on("click", ".post__report", (e) => toggleReport(e));
postsDiv.on("click", ".post__btn--comment", (e) => openCommentBox(e));
postsDiv.on("click", ".comment__btn--close", (e) => closeCommentBox(e));
postsDiv.on("click", ".comment__btn--post", (e) => postComment(e));
postsDiv.on("click", ".post__btn--viewComments", (e) => viewComments(e));

function getComments(postId, commentContainer) {
    $.get("/action/comments/"+postId, (data, status) => {
        if (status !== "success") {
            alert("Failed at getting comments");
            console.log(data, status);
        }
        else {
            populateComments(commentContainer, data.comments);
        }
    });
}

function populateComments(commentContainer, comments) {
    commentContainer.empty();
    for (let i=0; i<comments.length; i++) {
        const {body, user, date} = comments[i];
        commentContainer.append(`
            <div class="comment">
                <p>${body}</p>
                <div class="comment__meta">
                    <span class="comment__username">${user.username}</span>
                    <span class="comment__date">${date.split("::")[0]}</span>
                </div>
            </div>
        `);
    }
}

function viewComments(e) {
    e.preventDefault();
    const target = $(e.target);
    const postId = getPostId(e);
    const commentContainer = target.parents(".post").children("div.comments");
    getComments(postId, commentContainer);
}

function postComment(e) {
    e.preventDefault(e);
    const target = $(e.target);
    const commentContainer = target.parents(".commentContainer");
    const body = commentContainer.children("#comment").val();
    const postId = getPostId(e);
    $.post("/action/comment", {postId, body}, (data, status) => {
        if (status !== "success") {
            alert("Posting comment failed");
            console.log(data, status);
        }
    });
    viewComments(e);
}

function closeCommentBox(e) {
    e.preventDefault();
    $(".post__btn--comment").removeClass("hidden");
    $(".commentContainer").remove();
}

function openCommentBox(e) {
    e.preventDefault();
    closeCommentBox(e);
    const target = $(e.target);
    target.addClass("hidden");
    const postDiv = target.parents(".post");
    postDiv.append(`
        <div class="commentContainer">
            <a class="comment__btn--close">
                <i class="fa fa-window-close"></i>
            </a>
            <label for="comment">Comment</label>
            <input type="text" id="comment" />
            <button class="comment__btn--post">Post</button>
        </div>`);
}


function postAction(url, postId) {
    $.post(url, {postId}, (data, status) => {
        if (status !== "success") {
            alert("Error with action");
            console.log(data, status);
        }
    })
}

function handlePostAction(e, targetClass, action) {
    e.preventDefault();
    const postId = getPostId(e);
    const actionClass = getActionClass(e);
    if (actionClass.includes(targetClass)) {
        postAction("/action/add/"+action, postId);
    }
    else {
        postAction("/action/remove/"+action, postId);
    }
    loadPosts();
}

function toggleLike(e) {
    handlePostAction(e, "fa-thumbs-o-up", "like");
}

function toggleDislike(e) {
    handlePostAction(e, "fa-thumbs-o-down", "dislike");
}

function toggleReport(e) {
    handlePostAction(e, "fa-flag-o", "report");
}

function getPostId(e) {
    return $(e.target).parents(".post").attr("id");
}

function getActionClass(e) {
    return $(e.target).attr("class");
}

function submitPost(e) {
    e.preventDefault();
    const postTitle = $("#title").val();
    const caption = $("#caption").val();
    $.post("/dashboard/forum", {title: postTitle, caption}, (data, status) => {
        if (status !== "success") {
            alert("Error posting");
            console.log(data, status);
        }
        else {
            loadPosts();
        }
    });
}

function loadPosts() {
    $.get("/dashboard/posts", (data, status) => {
        if (status !== "success") {
            alert("Bad request");
            console.log(data, status);
        }
        else {
            populatePosts(data);
        }
    });
}

function populatePosts(posts) {
    postsDiv.empty();
    for (let i=0; i<posts.length; i++) {
        const post = posts[i];
        const {title, body, user, date, likes, dislikes, reports} = post;
        const likeClass = likes.includes(user._id) ? "fa-thumbs-up" : "fa-thumbs-o-up";
        const dislikeClass = dislikes.includes(user._id) ? "fa-thumbs-down" : "fa-thumbs-o-down";
        const reportClass = reports.includes(user._id) ? "fa-flag" : "fa-flag-o";
        postsDiv.append(`
        <div id="${post._id}" class="post">
            <h2>${title}</h2>
            <span>${body}</span>
            <div class="post__meta">
                <span class="post__username">${user.username}</span>
                <span class="post__date">${date.split("::")[0]}</span>
            </div>
            <div class="post__action">
                <span>${likes.length}</span>
                <a class="post__like">
                    <i class="fa ${likeClass}"></i>
                </a>
                <span>${dislikes.length}</span>
                <a class="post__dislike">
                    <i class="fa ${dislikeClass}"></i>
                </a>
                <span>${reports.length}</span>
                <a class="post__report">
                    <i class="fa ${reportClass}"></i>
                </a>
            </div>
            <div class="comments"></div>
            <button class="post__btn--viewComments">view comments</button>
            <button class="post__btn--comment">add comment</button>
        </div>`);    
    }
};