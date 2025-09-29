import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";

import { signJWT } from "../utils/jwt.js";

export async function register(req, res) {
    //Accept: email, password, confirmPassword, name, age
    
    const { email, password, confirmPassword, name, age } = req.body;

    if (!email || !password || !confirmPassword || !name || !age) {
        return res.status(400).send({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
        return res.status(400).send({ message: "Passwords do not match" });
    }
    if (age < 18) {
        return res.status(400).send({ message: "You must be at least 18 years old" });
    }

    //Hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    //Store user in database
    const existingUser = await prisma.user.findUnique({
            where: { email: email }
    });
    if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
    }
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            age
        }
    });

    //Return JWT token and user info (no password)
    const token = signJWT({ userId: newUser.id });
    newUser.password = undefined;
    res.status(201).json({
            message: "User registered successfully",
            data: { user: { email: newUser.email, name: newUser.name, age: newUser.age }, token }
    });
}



export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required" });
    }
    //Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).send({ message: "Invalid email" });
    }

    //Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send({ message: "Invalid password" });
    }

    const token = signJWT({ userId: user.id });
    user.password = undefined;

    res.status(201).json({
            message: "User logged in successfully",
            data: { user: { email: user.email, name: user.name, age: user.age }, token }
    });
}