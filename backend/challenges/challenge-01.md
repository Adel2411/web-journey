# 🎯 Backend Challenge 1: **Express API & Database Foundation**

> **Build the foundational API structure for CollabNote with basic note management**

Welcome to your first backend challenge! You'll create the core API that powers CollabNote's note management system using Express.js and Prisma. This API will serve as the data source for the frontend React application.

---

## 🎯 Challenge Objectives

By completing this challenge, you'll build:

- ⚙️ **Express.js API setup** with proper middleware configuration
- 🗃️ **PostgreSQL database** with Prisma ORM integration
- 📝 **Basic note CRUD operations** (Create, Read, Update, Delete)
- 🧪 **API testing** with proper request/response handling
- 🛡️ **Basic validation** and error handling
- 🔗 **Frontend-ready API** that connects seamlessly with React

---

## 🛠️ Prerequisites

- Completed Backend Session 1 (Express.js basics, middleware, Prisma)
- Node.js and npm installed
- PostgreSQL database running locally or cloud instance
- Basic understanding of REST API concepts

---

## 📋 Challenge Tasks

### 🗃️ **Task 1: Database Setup with Prisma**

You'll be working in the existing Express project structure.

1. **Navigate to your backend directory:**

   ```bash
   cd project/backend
   ```

2. **Install Prisma and database dependencies:**

   ```bash
   npm install prisma @prisma/client cors dotenv
   npx prisma init
   ```

3. **Set up your environment variables:**

   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your PostgreSQL database connection string:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/collabnote_db"
     ```
   - Replace `username`, `password`, and database name with your actual PostgreSQL credentials

4. **Create your database schema** in `prisma/schema.prisma`:

   - `Note` model with fields: id, title, content, authorName, isPublic, createdAt, updatedAt
   - Ensure field names match what the frontend expects

5. **Generate Prisma client and run migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### ⚙️ **Task 2: Express Server Setup**

1. **Update the main server file** (`src/app.js`):

   - Configure CORS to allow frontend connections (port 5173 for Vite)
   - Add dotenv configuration
   - Set up basic error handling
   - Change server port to 5000 (to avoid conflicts with frontend)

2. **Create a basic route structure:**
   ```
   src/
   ├── routes/
   │   └── notes.js    # Note management routes
   └── app.js          # Main server file (already exists)
   ```

### 📝 **Task 3: Basic Note Management API**

**Create note routes** (`src/routes/notes.js`):

1. **GET /api/notes**

   - Return all notes from database
   - Include all note information
   - Handle empty database case
   - Format response for frontend consumption

2. **POST /api/notes**

   - Accept: title, content, authorName (optional), isPublic (optional, default true)
   - Validate required fields (title, content)
   - Create note in database
   - Return created note with generated ID and timestamps

3. **GET /api/notes/:id**

   - Return specific note by ID
   - Return 404 if note doesn't exist
   - Include all note details

4. **PUT /api/notes/:id**

   - Accept: title, content, authorName, isPublic
   - Update existing note with new updatedAt timestamp
   - Return updated note
   - Return 404 if note doesn't exist

5. **DELETE /api/notes/:id**
   - Delete note by ID
   - Return success message
   - Return 404 if note doesn't exist

---

## 🎯 Expected API Endpoints

Your API should support these endpoints that the frontend will consume:

```
Notes:
GET    /api/notes           # Get all notes (for frontend display)
POST   /api/notes           # Create new note (for frontend forms)
GET    /api/notes/:id       # Get specific note (for frontend detail view)
PUT    /api/notes/:id       # Update note (for frontend editing)
DELETE /api/notes/:id       # Delete note (for frontend deletion)
```

---

## 📝 Sample Request/Response Examples

### Get All Notes (Frontend will display these)

```javascript
// GET /api/notes
// Response (matches frontend data structure)
[
  {
    id: 1,
    title: "Welcome to CollabNote",
    content:
      "This is your first note in CollabNote! You can create, edit, and share notes with your team.",
    authorName: "John Doe",
    isPublic: true,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: 2,
    title: "React Best Practices",
    content:
      "Important guidelines for React development: Use functional components, leverage hooks properly...",
    authorName: "Sarah Smith",
    isPublic: true,
    createdAt: "2024-01-14T14:20:00.000Z",
    updatedAt: "2024-01-14T14:20:00.000Z",
  },
];
```

### Create Note (Future frontend forms will use this)

```javascript
// POST /api/notes
{
  "title": "My First Note",
  "content": "This is the content of my note",
  "authorName": "John Doe",
  "isPublic": true
}

// Response (frontend will display this new note)
{
  "id": 3,
  "title": "My First Note",
  "content": "This is the content of my note",
  "authorName": "John Doe",
  "isPublic": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔗 Frontend Integration

### CORS Configuration

Make sure your Express server allows requests from the React frontend:

```javascript
// In your src/app.js
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server URL
    credentials: true,
  }),
);
```

### Environment Setup

Your updated `src/app.js` should look like this:

```javascript
// src/app.js - Updated for CollabNote
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend URL
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.get("/", (_, res) => {
  res.json({ message: "CollabNote API is running!" });
});

app.use("/api/notes", notesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`CollabNote API server is running on http://localhost:${PORT}`);
});
```

### Data Format Consistency

Ensure your API responses match the data structure the frontend expects:

- Use consistent field names (id, title, content, authorName, isPublic, createdAt, updatedAt)
- Return proper HTTP status codes
- Include all necessary fields in responses

---

## ✅ Testing Your Implementation

### Manual Testing with Postman/Thunder Client:

1. **Test note creation** - should create note and return with ID
2. **Test note retrieval** - should return all notes (frontend will fetch these)
3. **Test single note fetch** - should return specific note by ID
4. **Test note updates** - should update and return modified note
5. **Test note deletion** - should remove note and return success
6. **Test CORS** - should allow requests from localhost:5173
7. **Test validation** - should reject invalid requests
8. **Test error cases** - should handle non-existent IDs properly

### Test Checklist:

- [✅] Can create notes with valid data
- [✅] Cannot create notes without required fields
- [✅] Can retrieve all notes (matching frontend sample data format)
- [✅] Can retrieve specific note by ID
- [✅] Returns 404 for non-existent note IDs
- [✅] Can update existing notes
- [✅] Can delete notes
- [✅] CORS allows frontend connections
- [✅] Proper error messages for invalid requests
- [✅] Server handles database connection errors

### 🔗 Integration Testing

Once you complete this challenge:

1. Start your backend server (`npm run dev` - uses node --watch)
2. The frontend from **Frontend Challenge 1** should be able to connect and display your notes
3. Future frontend challenges will add forms to create/edit notes using your API

---

## 🚀 Bonus Challenges (Optional)

If you finish early, try these additional features:

1. **Enhanced Validation**

   - Add minimum length requirements for title and content
   - Validate that title is not empty or just whitespace
   - Add maximum length limits

2. **Frontend-Friendly Features**

   - Add pagination support for large note lists
   - Add search functionality by title or content
   - Add sorting options (newest first, alphabetical)

3. **Better Error Handling**
   - Create consistent error response format
   - Add detailed error messages
   - Handle database connection errors gracefully

---

## 📁 Project Structure

Your backend should look like this:

```
project/backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── routes/
│   │   └── notes.js
│   └── app.js (updated)
├── .env (created from .env.example)
├── .env.example
├── package.json (existing)
└── README.md
```

---

## 📤 Submission

1. **Test your API thoroughly** using Postman or similar tool
2. **Verify CORS configuration** allows frontend connections
3. **Document your endpoints** in a README file
4. **Commit your code** with clear commit messages
5. **Create a pull request** following the [Contributing Guide](../../CONTRIBUTING.md)
6. **Include a brief description** of your implementation and any challenges faced

---

## 🆘 Need Help?

- 📖 **Review Backend Session 1** materials for Express and Prisma basics
- 💬 **Ask questions** in the [Discussions](https://github.com/Adel2411/web-journey/discussions)
- 🐛 **Report issues** if you encounter problems
- 👥 **Learn from others** by reviewing submitted solutions

---

**🎉 Ready to build the foundation of CollabNote's backend? Let's get started!**

> **Next:** Once you complete this challenge, Challenge 2 will introduce user authentication and note ownership!
>
> **🔗 Related:** Complete **Frontend Challenge 1** to build the UI that will connect to this API!
> **🔗 Related:** Complete **Frontend Challenge 1** to build the UI that will connect to this API!
