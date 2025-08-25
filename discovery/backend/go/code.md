# Building a REST API in Go with Chi

**Goal:** Show how to build a RESTful API in Go using the `chi` framework. This guide covers routing, middleware, handling JSON, and performing CRUD operations on an in-memory data store.

## Table of Contents

0.  [Prerequisites](#prerequisites)
1.  [Project Setup](#project-setup)
2.  [In-Memory Data & Initialization](#in-memory-data--initialization)
3.  [The Data Model (Structs)](#the-data-model-structs)
4.  [Routing & Middleware](#routing--middleware)
5.  [Create a Post (POST)](#create-a-post-post)
6.  [Get All Posts (GET)](#get-all-posts-get)
7.  [Get a Specific Post (GET)](#get-a-specific-post-get)
8.  [Delete a Post (DELETE)](#delete-a-post-delete)
9.  [Final Code Walkthrough](#final-code-walkthrough)
10. [Resources](https://www.google.com/search?q=%23resources)

## Prerequisites

Before starting, ensure you have a recent version of Go installed on your system. You can check this by running `go version` in your terminal.

## Project Setup

First, create a new directory for your project, navigate into it, and initialize your Go module. Then, install the `chi` package, which is a lightweight and idiomatic router for building Go HTTP services.

```sh
# Create a project directory
mkdir go-chi-api && cd go-chi-api

# Initialize go module
go mod init go-chi-api

# Install dependencies
go get github.com/go-chi/chi/v5
```

## In-Memory Data & Initialization

For simplicity, this example does not use a database. Instead, we'll store our data in a simple in-memory slice called `posts`. The `init()` function is a special Go function that runs before `main()`, making it the perfect place to populate our slice with some initial sample data. A `nextID` variable will keep track of the ID for the next post to be created.

### `main.go` (Data Initialization)

```go
package main

// ... imports

// Post struct definition
type Post struct {
    ID      int    `json:"id"`
    Title   string `json:"title"`
    Content string `json:"content"`
    Author  string `json:"author"`
}

var posts []Post
var nextID = 1

// init runs before main() to set up initial data
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

// ... main function and handlers
```

## The Data Model (Structs)

We define a `Post` struct to model the data in our application. The `json:"..."` tags are essential. They tell Go's `encoding/json` package how to map the struct fields to and from JSON keys when our API communicates with clients.

### `main.go` (Struct definition)

```go
type Post struct {
    ID      int    `json:"id"`
    Title   string `json:"title"`
    Content string `json:"content"`
    Author  string `json:"author"`
}
```

## Routing & Middleware

In `main()`, we create a new router instance with `chi.NewRouter()`. We then attach several useful middleware:

- `middleware.Logger`: Logs incoming requests, method, URL, and processing time.
- `middleware.Recoverer`: Catches panics from handler functions and responds with a `500 Internal Server Error`.
- `middleware.SetHeader`: Ensures all responses from this router have the `Content-Type: application/json` header.
- `middleware.Heartbeat`: Sets up a `/up` endpoint for simple health checks.

We use `r.Route("/posts", ...)` to group all endpoints related to posts under a common path, which helps in organizing the code.

### `main.go` (Routing part)

```go
func main() {
    r := chi.NewRouter()

    // Middleware stack
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.SetHeader("Content-Type", "application/json"))
    r.Use(middleware.Heartbeat("/up"))

    // Route group for /posts
    r.Route("/posts", func(r chi.Router) {
        r.Get("/", getPosts)       // GET /posts
        r.Post("/", createPost)      // POST /posts
        r.Get("/{id}", getPost)    // GET /posts/{id}
        r.Delete("/{id}", deletePost) // DELETE /posts/{id}
    })

    // ... server start
}
```

## Create a Post (POST)

The `createPost` handler decodes the JSON body from the `POST` request into a new `Post` struct. It performs basic validation to ensure required fields are not empty. If valid, it assigns a new ID, appends the post to the `posts` slice, and returns a `201 Created` status with the newly created post as a JSON response.

```go
func createPost(w http.ResponseWriter, r *http.Request) {
    var newPost Post

    if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    if newPost.Title == "" || newPost.Content == "" || newPost.Author == "" {
        http.Error(w, "Title, content, and author are required", http.StatusBadRequest)
        return
    }

    newPost.ID = nextID
    nextID++
    posts = append(posts, newPost)

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newPost)
}
```

## Get All Posts (GET)

To fetch all posts, the `getPosts` handler simply encodes the entire `posts` slice into a JSON array and writes it to the HTTP response writer.

```go
func getPosts(w http.ResponseWriter, r *http.Request) {
    if err := json.NewEncoder(w).Encode(posts); err != nil {
        http.Error(w, "Error encoding posts", http.StatusInternalServerError)
        return
    }
}
```

## Get a Specific Post (GET)

To retrieve a single post, we use a URL parameter (`{id}`). The `getPost` handler extracts this ID using `chi.URLParam(r, "id")`. After converting the string ID to an integer, it iterates through the `posts` slice. If a post with the matching ID is found, it's encoded as JSON and returned. Otherwise, it returns a `404 Not Found` error.

```go
func getPost(w http.ResponseWriter, r *http.Request) {
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

    http.Error(w, "Post not found", http.StatusNotFound)
}
```

## Delete a Post (DELETE)

Deleting a post follows a similar pattern to getting one. We find the post by its ID from the URL parameter. To remove it from the slice, we use the `append` function trick: `posts = append(posts[:i], posts[i+1:]...)`. This creates a new slice containing all elements except the one at index `i`. A successful deletion returns a `204 No Content` status.

```go
func deletePost(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid post ID", http.StatusBadRequest)
        return
    }

    for i, post := range posts {
        if post.ID == id {
            posts = append(posts[:i], posts[i+1:]...)
            w.WriteHeader(http.StatusNoContent)
            return
        }
    }

    http.Error(w, "Post not found", http.StatusNotFound)
}
```

## Final Code Walkthrough

Here is the complete `main.go` file, combining the data model, initialization, routing, and all handler functions into a single, working REST API server.

```go
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
    r.Use(middleware.SetHeader("Content-Type", "application/json"))
    r.Use(middleware.Heartbeat("/up"))

    r.Route("/posts", func(r chi.Router) {
        r.Get("/", getPosts)       // Get all posts
        r.Post("/", createPost)      // Create a new post
        r.Get("/{id}", getPost)    // Get a specific post by ID
        r.Delete("/{id}", deletePost) // Delete a post by ID
    })

    fmt.Println("Server starting on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}

func getPosts(w http.ResponseWriter, r *http.Request) {
    if err := json.NewEncoder(w).Encode(posts); err != nil {
        http.Error(w, "Error encoding posts", http.StatusInternalServerError)
        return
    }
}

func createPost(w http.ResponseWriter, r *http.Request) {
    var newPost Post

    if err := json.NewDecoder(r.Body).Decode(&newPost); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    if newPost.Title == "" || newPost.Content == "" || newPost.Author == "" {
        http.Error(w, "Title, content, and author are required", http.StatusBadRequest)
        return
    }

    newPost.ID = nextID
    nextID++
    posts = append(posts, newPost)

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newPost)
}

func getPost(w http.ResponseWriter, r *http.Request) {
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

    http.Error(w, "Post not found", http.StatusNotFound)
}

func deletePost(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid post ID", http.StatusBadRequest)
        return
    }

    for i, post := range posts {
        if post.ID == id {
            posts = append(posts[:i], posts[i+1:]...)
            w.WriteHeader(http.StatusNoContent)
            return
        }
    }

    http.Error(w, "Post not found", http.StatusNotFound)
}
```

## Resources

- [Chi Router Docs](https://pkg.go.dev/github.com/go-chi/chi/v5)
- [Go by Example](https://gobyexample.com)
- [Go Docs: net/http](https://pkg.go.dev/net/http)
- [Go Docs: encoding/json](https://pkg.go.dev/encoding/json)
