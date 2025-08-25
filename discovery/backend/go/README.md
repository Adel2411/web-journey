# 🧠 Go Beyond JavaScript — Golang Discovery Workshop

Welcome to the **Golang Discovery Workshop**, where we explore the power of Go in building fast, simple, and scalable backend applications. This hands-on workshop is perfect for developers with JavaScript/Node.js experience who are curious about what Go can offer in backend development.

> 🎯 **Goal:** Learn Go fundamentals and build a REST API using the [`chi`](https://github.com/go-chi/chi) router — all while comparing concepts with JavaScript/Node.js.

---

## 📁 Repository Structure

```text
.
├── cmd/
│   ├── blog-api/         # Main REST API project (Chi + Go)
│   │   └── blog.go
│   └── fundamentals/     # Go basics (variables, structs, functions)
│       └── fundamentals.go
├── docs/
│   ├── code.md           # Full code walk-through for the blog API
│   ├── compare.md        # JS ↔ Go feature comparison (cheatsheet)
│   ├── fundamentals.md   # Quick guide to Go basics
│   └── index.html        # Reveal.js slides (open in browser)
├── go.mod                # Go module file
├── go.sum                # Module dependency checksums
└── README.md             # You are here 🚀
```

---

## 📌 What You’ll Learn

✅ How Go compares to JavaScript (side-by-side examples)  
✅ Structs, variables, error handling, and routing in Go  
✅ REST API development using `chi` router  
✅ Working with JSON and in-memory data  
✅ Middleware and modular code organization

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Go installed](https://go.dev/dl) (1.23 or later)
- Basic terminal knowledge

### 🔧 Setup

```bash
# Clone the repo
git clone https://github.com/edaywalid/go-beyond-javascript.git
cd go-beyond-javascript

# Run the blog API server
cd cmd/blog-api
go run blog.go
```

> 🌐 The API runs on: `http://localhost:8080`

### 📚 Try It Out

Test the following API routes using [Postman](https://www.postman.com/) or `curl`:

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | `/posts`      | Fetch all posts        |
| POST   | `/posts`      | Create a new post      |
| GET    | `/posts/{id}` | Fetch a specific post  |
| DELETE | `/posts/{id}` | Delete a specific post |
| GET    | `/up`         | Health check           |

---

## 🧠 Learn by Reading

- 📘 [Workshop Code Guide](./code.md) – step-by-step breakdown of the REST API
- 📘 [Go vs Node.js Cheatsheet](./compare.md) – Go equivalents for common JS tasks
- 📘 [Go Fundamentals](./fundamentals.md) – syntax, variables, structs, and more
- 📘 [📽 Slides (index.html)](./index.html) – open in browser locally for full workshop slides or u can visit [link](https://edaywalid.github.io/go-beyond-javascript/)

---

## 🌐 Useful Resources

- [Go by Example](https://gobyexample.com)
- [The Go Programming Language Tour](https://tour.golang.org)
- [Go Chi Router Docs](https://pkg.go.dev/github.com/go-chi/chi/v5)
- [Go Standard Library Docs](https://pkg.go.dev/std)

---

## 🙌 About This Workshop

This project was developed as part of **Discovery Week** at **MicroClub** to introduce developers to modern backend development with Go. It’s beginner-friendly, comparison-based, and designed for rapid hands-on learning.

---

## 💬 Questions or Feedback?

Feel free to reach out or open an issue if you have questions, feedback, or ideas!

---

**⭐️ Don’t forget to star this repo if you found it useful!**
