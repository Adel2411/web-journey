# Complete JWT Authentication Course with Express.js and MongoDB

Welcome to this beginner-friendly course where you'll learn how to build a **complete authentication system** using **JWT (JSON Web Tokens)** in **Node.js with Express** and **MongoDB**.

## What You Will Learn

- What JWT is and why we use it
- How to hash passwords securely with `bcryptjs`
- How to structure a basic Express server with MongoDB
- How to register and login users securely
- How to protect routes using middleware
- Best practices for token management

## Prerequisites

To follow this course, you should be familiar with:

- Basic JavaScript and Node.js
- Express.js (routing and middleware)
- MongoDB and Mongoose (basic schema)

## 1. Project Setup

Start by initializing a new Node.js project:

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv
```

Then, create the following files:

```
project/
├── index.js
├── .env
```

In your `.env` file, add:

```
MONGO_URI=mongodb://localhost:27017/auth-jwt
```

## 2. Connecting to MongoDB

We use Mongoose to connect to the MongoDB database:

```js
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
```

This will establish a live connection to your MongoDB server.

## 3. User Model (Schema)

Define the fields a user will have:

```js
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
});
```

> `email` is unique, and the password is required to be hashed.

## 4. What is JWT and Why Use It?

JWT stands for **JSON Web Token**. It's a secure way to represent a user’s identity and verify it between client and server.

JWT contains:

- **Header** – Type and algorithm
- **Payload** – User data (like ID)
- **Signature** – Ensures token is not modified

We sign tokens using a secret key (`jwtSecret`) and use them to protect private routes.

## 📥 5. Register Route (`/register`)

This route handles user registration. Steps:

1. Validate input (e.g., passwords match, age >= 18)
2. Hash password with `bcrypt`
3. Store user in DB
4. Return a JWT token

```js
app.post("/register", async (req, res) => {
  const { email, password, confirmPassword, name, age } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  if (age < 18)
    return res
      .status(400)
      .json({ message: "You must be at least 18 years old" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, name, age });
  await user.save();

  const token = jwt.sign({ userId: user._id }, "jwtSecret", {
    expiresIn: "1h",
  });
  user.password = undefined;

  res.status(201).json({
    message: "User registered successfully",
    data: { user, token },
  });
});
```

## 6. Login Route (`/login`)

Steps:

1. Check if user exists
2. Compare password using `bcrypt.compare`
3. Return a JWT token

```js
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (!userExists) return res.status(404).json({ message: "User not found" });

  const isValidPassword = await bcrypt.compare(password, userExists.password);
  if (!isValidPassword)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ userId: userExists._id }, "jwtSecret", {
    expiresIn: "1h",
  });
  userExists.password = undefined;

  res.status(200).json({
    message: "Login successful",
    data: { user: userExists, token },
  });
});
```

## 7. Protecting Routes with Middleware

Create a middleware to check if a JWT token is valid before accessing certain routes:

```js
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Not Authorized" });

  try {
    const decoded = jwt.verify(token, "jwtSecret");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}
```

Use this middleware on private routes.

## 8. Secret Route (`/secret`)

This is an example of a protected route that only logged-in users can access.

```js
app.get("/secret", authenticate, async (req, res) => {
  res.send({ message: "my route secret" });
});
```

To access this, you must include the token in your `Authorization` header.

## 9. Run the Server

```js
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
```

## 10. Testing with Postman

### Register

**POST** `/register`

```json
{
  "email": "gaza@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "name": "Yahia Sinwar",
  "age": 21
}
```

### Login

**POST** `/login`

```json
{
  "email": "gaza@example.com",
  "password": "123456"
}
```

Use the returned token like this:

```
Authorization: <your-token>
```

### Access secret route without token

**GET** `/secret` → Unauthorized

### Access secret route with token

**GET** `/secret` → Success

## Final Tips

- Never expose your `jwtSecret`, always store it in `.env`
- Use HTTPS in production
- Use `httpOnly` cookies for better security (next step)
- Tokens should be short-lived; use refresh tokens for longer sessions

## Summary

You have successfully built a secure authentication system using:

- JWTs for stateless auth
- bcrypt for password security
- Middleware for route protection
- Express and Mongoose for a clean backend
