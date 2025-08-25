const formData = new FormData();

const fileInput = document.querySelector(
	'input[type="file"]'
) as HTMLInputElement;

const file: any = fileInput?.files?.[0];

formData.append("image", file);

const response = await fetch("/api/posts", {
	method: "POST",
	headers: {
		"Content-Type": "multipart/form-data", // not a must (the browser will set it auto)
	},
	body: formData,
});
