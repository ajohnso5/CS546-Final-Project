const postsDiv = $("#posts");


$(document).ready(() => loadPosts());
$("#postForm").submit((e) => submitPost(e));
postsDiv.on("click", ".post__like", (e) => toggleLike(e));
postsDiv.on("click", ".post__dislike", (e) => toggleDislike(e));
postsDiv.on("click", ".post__report", (e) => toggleReport(e));


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
        console.log(`Adding ${action} to ${postId}`);
        postAction("/action/add/"+action, postId);
    }
    else {
        console.log(`Removing ${action} from ${postId}`);
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
            console.log(data);
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
    console.log(posts);
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
        </div>`);    
    }
};