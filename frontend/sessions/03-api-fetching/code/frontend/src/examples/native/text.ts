const textContent = "This is a simple text message";

const response = await fetch("/api/notes", {
	method: "POST",
	headers: {
		"Content-Type": "text/plain",
	},
	body: textContent,
});
