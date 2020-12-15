(function ($) {

	var requestConfig={
		type:"POST",
		url:"posts"
	}

	$.ajax(requestConfig).then(function(data){
		count = data.allPosts.length-1

			$(data.allPosts).each(function(i,post){
			
		    

			var posts = $('#posts')
			$('#posts div:first').before('<div id="post">')//each div will have an id of "post"
			$('#posts div:first').append('<h1 id = "postTitle">' + post.title + '</h1>')//each title for the post will have an id of "postTitle"
			$('#posts div:first').append('<img id="myImage" width="500">')// img id "myImage"
			$('#posts img:first').focus().attr("src",post.imagePath)//attaches uploaded image to img src
			$('#posts div:first').append('<p id="captionOnPost"> <strong>'+ data.usernames[i] + ': </strong>' + post.body + '</p>')//caption on the post id "captionOnPost"


			$('#posts div:first').append('<form id ="commentForm"> </form>')//form for comment id "commentForm"
			$('#post form:first').attr("class",post._id)//attaches unique post id to the form class

			$('#post form:first').append('<label for "comment"> Comment on post: </label')
			$('#post form:first').append('<input type="text" id = "comment">')//input for the text of the comment id "comment"

			$('#post form:first').append('<label for "submit"> Submit comment: </label')                 
			$('#post form:first').append('<input id ="submit" type="button">')//submit button for specific comment form id "submit"

			//gets all comments for the current post in the loop from the database
			var requestConfig={
				type:"POST",
				url: "allcomments",
				contentType: 'application/json',
				async: false,
				data: JSON.stringify({
					postId : post._id
				})
			}
		
			

			$.ajax(requestConfig).then(function(data1){
				//data1 is the list of comments on a post
				if(data1.length != 0){
					$(data1).each(function(index,post){
						$('#posts div').eq(count).after('<p id="commentOnPost"> <strong>'+ post.username + ': </strong>' + post.comment + '</p>')//comment on the post itseld id "commendOnPost"

					})
				}
				count--
			});

		    $('#posts div:first').after('<hr>')
			$('#posts div:first').after('<br>')

			});

	})


	var post = $('#postForm')
	$(post).submit(function(event){
		event.preventDefault();

		caption = $('#caption').val()
		title = $('#title').val()
		//urlImage =$('#image').val()
		image = document.getElementById("image").files[0]
		urlImage = URL.createObjectURL(image)

		//this will send data to the database for the post
		var requestConfig={
			type: "POST",
			url: "forum",
			contentType: 'application/json',
			data: JSON.stringify({
				caption: caption,
				image: urlImage,
				title: title
			})
		};
		$.ajax(requestConfig).then(function(data){
			var posts = $('#posts')

			//this method of appending each content ensures that the most recent post will be at the top
			$('#posts div:first').before('<div id="post">') //each div will have an id of "post"
			$('#posts div:first').append('<h1 id = "postTitle">' + title + '</h1>') //each title for the post will have an id of "postTitle"
			$('#posts div:first').append('<img id="myImage" width="500">') // img id "myImage"
			$('#posts img:first').focus().attr("src",urlImage)//attaches uploaded image to img src
			$('#posts div:first').append('<p id="captionOnPost"> <strong>'+ data.username + ': </strong>' + caption + '</p>')//caption on the post id "captionOnPost"


			$('#posts div:first').append('<form id ="commentForm"> </form>')//form for comment id "commentForm"
			$('#post form:first').attr("class",data.thePost._id)//attaches unique post id to the form class

			$('#post form:first').append('<label for "comment"> Comment on post: </label')
			$('#post form:first').append('<input type="text" id = "comment">')//input for the text of the comment id "comment"

			$('#post form:first').append('<label for "submit"> Submit comment: </label')                 
			$('#post form:first').append('<input id ="submit" type="button">')//submit button for specific comment form id "submit"



		    $('#posts div:first').append('<hr>')//line after each post
			$('#posts div:first').append('<br>')
			$(post)[0].reset()
		});

	});



	//This is for the submit button for each comment on every form
	//when clicked will input a comment and the user who commented it on that post
	$(document).on('click','#submit', function(event) {
		event.preventDefault();
		var button = $(this)//"this" is the button that was clicked
		form =$(button).closest('form')//finds the form that the button that was clicked inside
		comment = $(form).find('#comment').val()//gets the value of the comment that was typed
		var postId = $(form).attr('class')//gets the unique id of the form that is the post id to be used to find the username
		
		//sends comment data to the database
		var requestConfig ={
        	type: "POST",
        	url: "comments",
        	contentType: 'application/json',
        	data: JSON.stringify({
        		comment : comment,
        		postId : postId
        	})
        };
        $.ajax(requestConfig).then(function(data){
        	$(form).after('<p id="commentOnPost"> <strong> ' + data.username + ': </strong>' + data.commentInfo.body + '</p>')//comment on the post itself id "commendOnPost"
        	$(form)[0].reset()
        })





	});




})(window.jQuery);