import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET ;


export const register = async (req, res) => {
    const { email, password, confirmPassword, name, age } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, age }
        });

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

        
        user.password = undefined;

        res.status(201).json({
            message: "User registered successfully",
            data: { user, token }
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to register user",
            error: err.message
        });
    }
};

export const login = async(req, res) => {
    console.log("LOGIN ENDPOINT HIT!"); 
    const { email, password } = req.body;

    try{
        const userExist = await prisma.user.findUnique({ where: { email } });
        if( !userExist ) {

            return res.status(400).json({
                message : "User not found"
            })
        }

        const validPassword = await bcrypt.compare(password, userExist.password)
        if( !validPassword )  {

            return res.status(400).json({
                message : "Invalid password"
            })
        }

        const token = jwt.sign({ userId : userExist.id }, jwtSecret , {expiresIn: "1h"})

        userExist.password = undefined;

        res.status(200).json({
            message : "Login successful", 
            data : {user :userExist, token }
        })

    } catch(err) {
        res.status(500).json({
            message: "Failed to Login",
            error: err.message
        })
    }
}