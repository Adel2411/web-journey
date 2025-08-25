import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/validatePassword.js";

const jwtSecret = process.env.JWT_SECRET ;


export const register = async (req, res) => {
    const { email, password, confirmPassword, name, age, role } = req.body;

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const passwordError = validatePassword(password);
        if(passwordError) {
            return res.status(400).json({
                message : passwordError
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old" });
        }

        if (role && !["USER", "ADMIN"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be USER or ADMIN" });
        }


        const existingUser = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { 
                email : email.trim().toLowerCase(), 
                password: hashedPassword,
                name :name.trim(),
                age,
                role: role || "USER"
            }
        });

        const token = jwt.sign({ userId: user.id, name: user.name, role: user.role  }, jwtSecret, { expiresIn: "1h" });

        
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

        const token = jwt.sign({ userId : userExist.id, name: userExist.name, role: userExist.role }, jwtSecret , {expiresIn: "1h"})

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