import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./utils/connect.js";
import { Login, Register } from "./controllers/auth.controller.js";
import { authenticate } from "./middlewares/authenticate.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Routes
app.get("/", (_, res) => {
  res.send("Welcome to the User Management API");
});

app.post("/register", Register);

app.post("/login", Login);

app.get("/secret", authenticate, async (_, res) => {
  // This route is protected by the authenticate middleware
  res.send({
    message: "my route secret",
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
