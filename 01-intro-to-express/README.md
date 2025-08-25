# 🏆 Mini Blog API Challenge

**Master Express.js fundamentals through hands-on backend development!**

Welcome to this exciting Express.js challenge! This experience is designed to help you apply what you've learned in our workshops through practical server-side coding. Below you'll find everything you need to get started, including setup instructions and clear submission guidelines.

---

## 📖 Challenge Overview

- **Challenge Name:** Mini Blog API Challenge (Express.js – No DB)
- **Track:** Backend
- **Level:** Beginner
- **Technologies:** Express.js, Node.js
- **Goal:** Build a REST API for managing blog posts using Express.js and custom middleware — without using a database.

---

## 🧠 Learning Objectives

By completing this challenge, you'll master:

- ✅ Creating RESTful routes in Express.js
- ✅ Implementing custom middleware functions
- ✅ Handling query parameters and dynamic routes
- ✅ Managing in-memory data structures

---

## 📁 Project Structure

```bash
01-intro-to-express/
├── starter/              # Your workspace - code here!
│   ├── src/             # Source code directory
│   │   ├── routes/           # API route handlers
│   │   │   └── posts.js      # Blog post routes
│   │   ├── controllers/      # Business logic
│   │   │   └── postController.js  # Post CRUD operations
│   │   ├── middleware/       # Custom middleware functions
│   │   │   ├── logger.js     # Request logging middleware
│   │   │   ├── validation.js # Request validation middleware
│   │   │   └── timestamp.js  # Timestamp injection middleware
│   │   ├── data/            # In-memory data storage
│   │   │   └── posts.js     # Blog posts array
│   │   └── app.js           # Main Express application
│   ├── package.json     # Project dependencies and scripts
│   └── README.md        # Challenge-specific instructions
├── solution/            # Reference solution (unlocked after deadline)
└── README.md           # This file
```

---

## 🚀 Getting Started

### 🛠 Prerequisites

Make sure you have these installed:

- **Node.js** (version 18+) - [https://nodejs.org/](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (we recommend VS Code: [https://code.visualstudio.com/](https://code.visualstudio.com/))
- Git for version control
- Postman or Thunder Client (for API testing)

### ⚡ Setup Instructions

Navigate to the challenge folder and follow these steps:

```bash
# 1. Navigate to the starter folder
cd 01-intro-to-express/starter

# 2. Install project dependencies
npm install

# 4. Start the development server
npm run dev

# 5. Your server will be running at http://localhost:3000
```

**What these commands do:**

- `npm install` - Downloads and installs all the packages your project needs
- `cp .env.example .env` - Creates your local environment configuration file
- `npm run dev` - Starts the server with automatic restart on file changes

> 🔄 Troubleshooting: If you encounter errors, try deleting the `node_modules` folder and `package-lock.json`, then run `npm install` again.

---

## 🎯 Your Mission

Create a REST API that allows users to manage blog posts in memory. Posts must include fields like `id`, `title`, `content`, `author`, and `createdAt`. You must implement required middlewares: logger, validation, and timestamp injection.

### 📋 Requirements Checklist

- Return all blog posts via GET /posts
- Return a single blog post by ID via GET /posts/:id
- Filter blog posts by author via GET /posts?author=
- Create a new blog post via POST /posts
- Edit a blog post via PUT /posts/:id
- Delete a blog post via DELETE /posts/:id

---

## 🔌 API Endpoints

Your API should follow RESTful standards for managing blog posts using an in-memory JavaScript array.

### 📋 Expected Endpoints

- `GET /posts` - Return all blog posts
- `GET /posts/:id` - Return a single blog post by ID
- `GET /posts?author=name` - Return posts by specific author
- `POST /posts` - Create a new blog post
- `PUT /posts/:id` - Update a blog post by ID
- `DELETE /posts/:id` - Delete a blog post by ID

### 📝 Request/Response Examples

```http
POST /posts
Content-Type: application/json

{
  "title": "Why I Love Express",
  "content": "Because it's simple and fast.",
  "author": "Sarah"
}
```

Response (201 Created):

```json
{
  "id": 1,
  "title": "Why I Love Express",
  "content": "Because it's simple and fast.",
  "author": "Sarah",
  "createdAt": "2025-06-12T12:00:00.000Z"
}
```

---

## 🔧 Middleware Requirements

Your API must implement three custom middleware functions that handle essential request processing:

### 🪵 Logger Middleware (`middleware/logger.js`)

Creates detailed request logs for debugging and monitoring:

```javascript
// Example log output:
// [2025-01-15T10:30:45.123Z] GET /posts - Headers: {...} - Body: undefined
// [2025-01-15T10:31:02.456Z] POST /posts - Headers: {...} - Body: {"title":"New Post","content":"..."}
```

**Requirements:**

- Log request method (GET, POST, PUT, DELETE)
- Log request route/path
- Log request headers
- Log request body (if present)
- Include timestamp in ISO format
- Apply to all routes

### ✅ Validation Middleware (`middleware/validation.js`)

Validates incoming requests without external libraries:

**For POST /posts requests:**

- `title` (required, string, non-empty)
- `content` (required, string, non-empty)
- `author` (required, string, non-empty)

**For PUT /posts/:id requests:**

- At least one field must be provided (`title`, `content`, or `author`)
- All provided fields must be non-empty strings

**Error Response:**

```json
{
  "error": "Validation failed",
  "message": "Missing required fields: title, content"
}
```

### ⏱️ Timestamp Middleware (`middleware/timestamp.js`)

Automatically manages timestamps for data operations:

**For POST requests:**

- Adds `createdAt` timestamp (ISO string)
- Adds `updatedAt` timestamp (ISO string, same as createdAt)

**For PUT requests:**

- Updates `updatedAt` timestamp (ISO string)
- Preserves original `createdAt` timestamp

---

## 🧪 Testing Your Solution

Before submitting, make sure to test your API:

```bash
# Start the development server
npm run dev

# Test with curl (example)
curl -X GET http://localhost:{PORT}/posts
```

Or use Postman, Insomnia, or Thunder Client (VS Code extension)

### ✅ Testing Checklist

- Server starts without errors
- All required endpoints respond correctly
- Request validation works as expected
- Error handling returns appropriate status codes
- Middleware logs and validates correctly

### 🛠️ Recommended Testing Tools

- Postman
- Thunder Client
- curl
- Insomnia

---

## 📋 Challenge Rules

- ❌ Do not modify the `solution/` folder — it's only for reference after the challenge deadline
- ✅ Work exclusively inside the `starter/` folder
- ✅ You may install additional npm packages if needed
- ✅ Keep your code clean, well-commented, and organized
- ✅ Follow Express.js best practices and RESTful API conventions
- ✅ Handle errors gracefully with appropriate HTTP status codes

---

## 💡 Helpful Resources

- **Express.js Routes Guide:** [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html)  
   Learn how to define and structure routes in Express, including route parameters and router modules.
- **Express.js Middleware Guide:** [https://expressjs.com/en/guide/using-middleware.html](https://expressjs.com/en/guide/using-middleware.html)  
   Understand how middleware works in Express and how to use it to handle requests, errors, logging, and more.

---

## 🚀 Submission Process

Once your API is ready:

1. 🧪 Test your endpoints thoroughly

2. 📝 Commit your changes inside the `starter/` folder:

```bash
git add .
git commit -m "Complete Mini Blog API Challenge"
```

3. 🔄 Push your solution to your forked repository:

```bash
git push origin main
```

4. 📤 Create a Pull Request to the original repository

### 🏷️ PR Requirements

Make sure to label your PR with:

- backend

PR Title Format: `[Backend] Mini Blog API Challenge - Your Name`

See the complete workflow in the CONTRIBUTING.md file.

---

## 💬 Get Support & Connect

Need help or want to share your progress?

- 🗣️ Ask questions in GitHub Discussions
- 🔍 Search existing discussions
- 🤝 Help others and learn together
- 💡 Share your API solutions and get feedback

Remember: Backend development can be tricky, but every challenge makes you stronger! 💙

---

## 🎉 What's Next?

After completing this challenge:

- ✨ Review the reference solution once it's unlocked
- 🚀 Move on to the next backend challenge in the series
- 🤝 Help other participants in the discussions
- 📚 Explore advanced Express.js concepts

**Happy coding, and remember - every API you build makes you a better developer!** 🌟
