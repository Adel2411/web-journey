const xmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<blog>
    <post>
        <title>My Blog Post</title>
        <content>This is the content</content>
    </post>
</blog>
`;

const response = await fetch("/api/posts/xml", {
	method: "POST",
	headers: {
		"Content-Type": "application/xml",
	},
	body: xmlData,
});
