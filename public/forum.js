//AJAX used for forum posts, unfinished, still need to work in database


(function ($) {
//On page load, will load database posts onto the page here using AJAX
// 
// 
// 
// 
// 
// 
// 
//
//
	var post = $('#postForm')
	$(post).submit(function(event){
		event.preventDefault();

		caption = $('#caption').val()
		image = document.getElementById("image").files[0]
		urlImage = URL.createObjectURL(image)

		//this will send data to the database
		var requestConfig={
			type: "POST",
			url: "forum",
			contentType: 'application/json',
			data: JSON.stringify({
				caption: caption,
				image: urlImage
			})
		};
		$.ajax(requestConfig)

		var requestConfig2={
			type: "GET",
			url: "forum",
		};

		$.ajax(requestConfig2).then(function(data){

			var posts = $('#posts')

			$('#posts div:first').before('<div id="post">')
			$('#posts div:first').append('<img id="myImage" width="200">')
			$('#posts img:first').focus().attr("src",urlImage)
			$('#posts div:first').append('<p> <strong> User: </strong>' + caption + '</p>')
		    $('#posts div:first').append('<hr>')
			$('#posts div:first').append('<br>')
			$(post)[0].reset()
		});


	});




})(window.jQuery);