import { createUser } from "../services/user.service.js";
import bcrypt from "bcryptjs";
import { signJWT } from "../utils/jwt.js";
import { User } from "../models/user.model.js";

export async function Register(req, res) {
  const { email, password, confirmPassword, name, age } = req.body;

  // Validate input
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (age < 18) {
    return res
      .status(400)
      .json({ message: "You must be at least 18 years old" });
  }

  if (!email || !password || !name || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Add User to database
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword, name, age);

    user.password = undefined; // Remove password from response
    const token = signJWT({ userId: user._id });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
}

export async function Login(req, res) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  const isValidPassword = await bcrypt.compare(password, userExists.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }

  userExists.password = undefined; // Remove password from response

  const token = signJWT({ userId: userExists._id });

  return res.status(200).json({
    message: "Login successful",
    data: {
      user: userExists,
      token,
    },
  });
}
