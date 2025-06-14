// Import the posts array from the posts.js file 
import posts from "../data/posts.js";

// Handler to retrieve all posts


// Handler to retrieve a single post by its ID
export const getPostById = (req, res) => {
  // Parse the ID from the request parameters and convert it to an integer
  const id = parseInt(req.params.id);
  // Log the ID for debugging purposes
  console.log(id);

  // Find the post in the posts array that matches the provided ID
  const post = posts.find((post) => {
    return post.id === id;
  });

  // If no post is found, send a 404 Not Found response with an error message
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    // If the post is found, send a 200 OK response with the post as JSON
    res.status(200).json(post);
  }
};

// Handler to process GET requests for posts, with optional author filtering
export const handleGetPosts = (req, res) => {
  // Extract the author query parameter from the request
  const author = req.query.author;

  // Log the author query parameter for debugging
  console.log(author);

  // Check if author parameter exists and is not an empty string after trimming
  if (author && author.trim() !== "") {
    // Store the trimmed author value to remove leading/trailing spaces
    const trimmedAuthor = author.trim();
    // Filter posts where the post's author matches the trimmed query parameter (case-insensitive)
    const result = posts.filter((post) => {
      return post.author.toLowerCase() === trimmedAuthor.toLowerCase();
    });
    // Log the filtered results for debugging
    console.log(result);
    // If matching posts are found, return 200 OK with the filtered posts
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      // If no posts match the author, return 404 Not Found with an error message
      return res.status(404).json({ message: "No posts found for this author" });
    }
  // Check if author parameter is an empty string
  } else if (author === "") {
    // Return 400 Bad Request with an error message for empty author parameter
    return res.status(400).json({ message: "Author name cannot be empty" });
  // Handle case where no author parameter is provided
  } else {
    // Return 200 OK with all posts when no author is specified
    return res.status(200).json(posts);
  }
};



// Handler to create a new post
export const createPost = (req, res) => {
  // Extract the new post data from the request body
  const post = req.body;
  // Log the new post for debugging purposes
  console.log(post);
  // Add the new post to the posts array
  posts.push(post);
  // Log the updated posts array for debugging purposes
  console.log(posts);
  // Send a 201 Created response with a success message and the created post
  res.status(201).json({ message: "Post created successfully", post });
};

// Handler to update an existing post by its ID
export const updatePostById = (req, res) => {
  // Parse the ID from the request parameters and convert it to an integer
  const id = parseInt(req.params.id);
  // Extract the updated post data from the request body
  const updatedPost = req.body;
  // Log the updated post data for debugging purposes
  console.log(updatedPost);
  // Find the index of the post in the posts array that matches the provided ID
  const indexPost = posts.findIndex((post) => post.id === id);

  // If no post is found, send a 404 Not Found response with an error message
  if (indexPost === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Update the post at the found index by merging the existing post with the updated data, preserving the ID
  posts[indexPost] = {
    ...posts[indexPost],
    ...updatedPost,
    id,
  };
  // Log the updated posts array for debugging purposes
  console.log(posts);
  // Send a 200 OK response with a success message and the updated post
  res.status(200).json({ message: "Post updated successfully", updatedPost });
};

// Handler to delete a post by its ID
export const deletePostById = (req, res) => {
  // Parse the ID from the request parameters and convert it to an integer
  const id = parseInt(req.params.id);
  // Find the index of the post in the posts array that matches the provided ID
  const indexPost = posts.findIndex((post) => post.id === id);

  // If no post is found, send a 404 Not Found response with an error message
  if (indexPost === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Remove the post from the posts array at the found index
  posts.splice(indexPost, 1);
  // Send a 200 OK response with a success message
  res.status(200).json({ message: "Post deleted successfully" });
};