# 🎯 Backend Challenge 2: **JWT Authentication & User Management**

> **Add secure user authentication to CollabNote with JWT tokens and protected note routes**

Welcome to your second backend challenge! You'll enhance the existing CollabNote API from Challenge 1 by adding user authentication using JWT tokens. Users will be able to register, login, and manage their personal notes securely.

---

## 🎯 Challenge Objectives

By completing this challenge, you'll enhance your existing API with:

- 🔐 **JWT Authentication system** with secure login/register endpoints
- 👤 **User model** with password hashing using bcryptjs
- 🛡️ **Protected routes** that require authentication
- 📝 **User-specific notes** (users can only manage their own notes)
- 🔒 **Middleware authentication** for route protection
- 🎫 **Token-based authorization** for API access

---

## 🛠️ Prerequisites

- Completed Backend Challenge 1 (Express API with notes CRUD)
- Your existing Express server with Prisma and PostgreSQL
- Understanding of JWT concepts and authentication flow
- Completed Backend Session 3 (JWT and Authentication) - recommended

---

## 📋 Challenge Tasks

### 🔧 **Task 1: Install Additional Dependencies**

Add authentication-related packages to your existing project:

```bash
cd project/backend
npm install jsonwebtoken bcryptjs
```

### 🗃️ **Task 2: Database Schema Updates**

**Update your Prisma schema** (`prisma/schema.prisma`):

1. **Add User model:**
   - id, email (unique), password, name, age
   - createdAt, updatedAt timestamps

2. **Update Note model:**
   - Add userId field to link notes to users
   - Add relation to User model
   - Keep existing fields from Challenge 1

3. **Apply database changes:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 🔐 **Task 3: Authentication Routes**

**Create authentication routes** (`src/routes/auth.js`):

1. **POST /api/auth/register**
   - Accept: email, password, confirmPassword, name, age
   - Validate: passwords match, age >= 18, email format
   - Hash password with bcryptjs (salt rounds: 10)
   - Create user in database
   - Return JWT token and user info (no password)

2. **POST /api/auth/login**
   - Accept: email, password
   - Validate: user exists, password matches
   - Return JWT token and user info (no password)

**JWT Configuration:**

- Use a strong secret key in environment variables
- Set token expiration (1 hour recommended)
- Include userId in token payload

### 🛡️ **Task 4: Authentication Middleware**

**Create authentication middleware** (`src/middleware/auth.js`):

1. **authenticate function:**
   - Extract token from Authorization header (Bearer token)
   - Verify JWT token using your secret
   - Add user info to request object (req.user)
   - Return 401 if token invalid or missing

### 📝 **Task 5: Update Notes Routes**

**Enhance your existing notes routes** (`src/routes/notes.js`):

1. **Apply authentication middleware to all note routes**
2. **Update route handlers to work with user context:**
   - **GET /api/notes** - Return only current user's notes
   - **POST /api/notes** - Create note for current user (add userId)
   - **GET /api/notes/:id** - Return note only if owned by current user
   - **PUT /api/notes/:id** - Update note only if owned by current user
   - **DELETE /api/notes/:id** - Delete note only if owned by current user

3. **Remove authorName field requirement** (use authenticated user's name)
4. **Add proper authorization checks** (users can't access other users' notes)

### ⚙️ **Task 6: Update Main App**

**Update your server file** (`src/app.js`):

1. **Add authentication routes:**

   ```javascript
   app.use("/api/auth", authRouter);
   ```

2. **Update environment variables** (`.env`):
   ```
   DATABASE_URL="your-existing-db-url"
   JWT_SECRET="your-very-secure-secret-key-here"
   ```

---

## 🎯 Expected API Endpoints

Your enhanced API should support these endpoints:

```
Authentication:
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login

Protected Notes (require Bearer token):
GET    /api/notes           # Get current user's notes
POST   /api/notes           # Create note for current user
GET    /api/notes/:id       # Get user's specific note
PUT    /api/notes/:id       # Update user's note
DELETE /api/notes/:id       # Delete user's note
```

---

## 📝 Sample Request/Response Examples

### User Registration

```javascript
// POST /api/auth/register
{
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "John Doe",
  "age": 25
}

// Response (201 Created)
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "age": 25,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Login

```javascript
// POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "age": 25
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Notes Request

```javascript
// GET /api/notes
// Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

// Response - Only current user's notes
[
  {
    id: 1,
    title: "My Personal Note",
    content: "This note belongs to the authenticated user",
    isPublic: true,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    user: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    },
  },
];
```

---

## 🔒 Security Requirements

### Password Security

- Hash passwords using bcryptjs with salt rounds >= 10
- Never return password hashes in API responses
- Validate password strength (minimum 6 characters)

### JWT Security

- Use strong secret key stored in environment variables
- Set reasonable token expiration (1 hour recommended)
- Validate token signature and expiration

### Input Validation

- Validate email format and uniqueness
- Ensure passwords match during registration
- Validate age requirements (>= 18)
- Sanitize all user inputs

### Authorization

- Users can only access their own notes
- Return 404 (not 403) for non-existent or unauthorized resources
- Implement proper error messages without exposing sensitive info

---

## 🔗 Database Schema Updates

Your updated Prisma schema should look like:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique @db.VarChar(100)
  password  String   @db.VarChar(255)
  name      String   @db.VarChar(100)
  age       Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  notes     Note[]   @relation("UserNotes")
}

model Note {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(100)
  content   String   @db.VarChar(1000)
  isPublic  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    Int
  user      User     @relation("UserNotes", fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## ✅ Testing Your Implementation

### Authentication Testing:

**Registration Tests:**

- [ ] Can register with valid data
- [ ] Cannot register with mismatched passwords
- [ ] Cannot register under age 18
- [ ] Cannot register with duplicate email
- [ ] Returns user data and JWT token

**Login Tests:**

- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Cannot login with non-existent email
- [ ] Returns user data and JWT token

### Protected Routes Testing:

**Authorization Tests:**

- [ ] Cannot access notes without token (401 Unauthorized)
- [ ] Cannot access notes with invalid token (401 Unauthorized)
- [ ] Can access own notes with valid token
- [ ] Cannot access other users' notes (404 Not Found)

**Notes CRUD with Authentication:**

- [ ] Can create notes (linked to authenticated user)
- [ ] Can retrieve only own notes
- [ ] Can update only own notes
- [ ] Can delete only own notes
- [ ] Notes include user information in responses

### Multi-User Testing:

1. Register two different users
2. Login as User A, create notes
3. Login as User B, verify cannot see User A's notes
4. Create notes as User B
5. Login as User A again, verify can only see own notes

---

## 🚀 Bonus Challenges (Optional)

1. **Enhanced Authentication:**
   - Add password reset functionality
   - Implement email verification
   - Add refresh token mechanism

2. **Advanced Authorization:**
   - Add user roles (admin, user)
   - Implement note sharing between users
   - Add collaborative note editing permissions

3. **Security Enhancements:**
   - Rate limiting for authentication endpoints
   - Account lockout after failed attempts
   - Enhanced password validation requirements

---

## 📁 Updated Project Structure

```
project/backend/
├── prisma/
│   ├── schema.prisma (updated with User model)
│   └── migrations/
├── src/
│   ├── routes/
│   │   ├── notes.js (updated with auth)
│   │   └── auth.js (new)
│   ├── middleware/
│   │   └── auth.js (new)
│   └── app.js (updated with auth routes)
├── .env (updated with JWT_SECRET)
├── .env.example
├── package.json (updated dependencies)
└── README.md (updated with auth endpoints)
```

---

## 📤 Submission

1. **Test all authentication flows** using Postman/Thunder Client
2. **Verify multi-user isolation** (users can only see their own notes)
3. **Test protected routes** with and without valid tokens
4. **Document your authentication endpoints** in README
5. **Create comprehensive test cases** for your submission
6. **Commit your code** with clear commit messages
7. **Create a pull request** following the [Contributing Guide](../../CONTRIBUTING.md)

---

## 🆘 Need Help?

- 📖 **Review Backend Session 3** for JWT authentication concepts
- 💬 **Ask questions** in [Discussions](https://github.com/Adel2411/web-journey/discussions)
- 🔍 **Check JWT.io** for token debugging
- 🛡️ **Review bcrypt documentation** for password hashing
- 🐛 **Report issues** if you encounter problems

---

**🎉 Ready to secure CollabNote with authentication? Let's build a robust auth system!**
