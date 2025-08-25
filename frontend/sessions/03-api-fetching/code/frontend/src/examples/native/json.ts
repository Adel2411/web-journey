const jsonData = {
	title: "My Blog Post",
	content: "This is the content",
	author: "John Doe",
};

const response = await fetch("/api/posts", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(jsonData), // object --> JSON
});
