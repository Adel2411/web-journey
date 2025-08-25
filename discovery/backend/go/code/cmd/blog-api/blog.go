package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Author  string `json:"author"`
}

var posts []Post
var nextID = 1

func init() {
	initializeSampleData()
}

func initializeSampleData() {
	posts = []Post{
		{ID: 1, Title: "Welcome to Go", Content: "Go is awesome for backend development!", Author: "Gopher"},
		{ID: 2, Title: "Why Choose Go?", Content: "Fast, simple, and reliable.", Author: "Developer"},
	}
	nextID = 3
}

func main() {

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// this one is the same as app.use(express.json()) in express
	r.Use(middleware.SetHeader("Content-Type", "application/json"))

	// Heartbeat endpoint for health checks
	r.Use(middleware.Heartbeat("/up"))

	// Define route group for posts /posts
	r.Route("/posts", func(r chi.Router) {
		r.Get("/", getPosts)          // Get all posts
		r.Post("/", createPost)       // Create a new post
		r.Get("/{id}", getPost)       // Get a specific post by ID
		r.Delete("/{id}", deletePost) // Delete a post by ID
	})

	fmt.Println("Server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8000", r))
}

func getPosts(w http.ResponseWriter, r *http.Request) {
	// Encode posts to JSON and send response
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Error encoding posts", http.StatusInternalServerError)
		return
	}
}

func createPost(w http.ResponseWriter, r *http.Request) {
	var newPost Post

	// Decode JSON from request body
	if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if newPost.Title == "" || newPost.Content == "" || newPost.Author == "" {
		http.Error(w, "Title, content, and author are required", http.StatusBadRequest)
		return
	}

	newPost.ID = nextID
	nextID++
	posts = append(posts, newPost)

	// Return created post
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newPost)
}

func getPost(w http.ResponseWriter, r *http.Request) {
	// Get ID from URL parameter
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	for _, post := range posts {
		if post.ID == id {
			json.NewEncoder(w).Encode(post)
			return
		}
	}

	// Post not found
	http.Error(w, "Post not found", http.StatusNotFound)
}

func deletePost(w http.ResponseWriter, r *http.Request) {
	// Get ID from URL parameter
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	// Find and remove post
	for i, post := range posts {
		if post.ID == id {
			posts = append(posts[:i], posts[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}

	// Post not found
	http.Error(w, "Post not found", http.StatusNotFound)
}
