const formData = new URLSearchParams();
formData.append("title", "My Blog Post");
formData.append("content", "This is the content");
formData.append("author", "John Doe");

const response = await fetch("/api/posts", {
	method: "POST",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	},
	body: formData.toString(), // "title=My+Blog+Post&content=This+is+the+content&author=John+Doe"
});
