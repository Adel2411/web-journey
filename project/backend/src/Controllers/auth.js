import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function signup(req,res){
    try {
        
        const {name , email , password , confirmPassword , age } = req.body ;

        const existing = await prisma.user.findUnique({ where: { email: email } });
        if (existing) {
        return res.status(400).json({ error: "Email already exists" });
        }

        if(password!==confirmPassword){
            return res.status(400).json({ error: "confirm password isn t identical to password" });
        }

        const hashedpassword = await bcrypt.hash(password , 10);

        const createUser = await prisma.user.create({
            data : {
            "name" : name ,
            "email" : email ,
            "password" : hashedpassword ,
            "age" : age
            }
        })
        
        const token = jwt.sign({ id: createUser.id  },process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRATION_TIME });

        res.json({
        message: "registration successful",
        user: {
                id: createUser.id,
                name: createUser.name,
                email: createUser.email,
                age: createUser.age
            },
        token
        });

    } catch (error) {
        res.status(500).json({ error: "an error has occured :" , error });
    }
}

export async function login(req,res){
    try {

        const {email , password } = req.body ;

        const existing = await prisma.user.findUnique({ where: { email: email } });
        if (!existing) {
        return res.status(400).json({ error: "there is no account with this email" });
        }

        const isMatch = await bcrypt.compare( password, existing.password);
        if(!isMatch){
           return  res.status(400).json({message: "password incorrect"});
        }

        const token = jwt.sign({ id: existing.id  },process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRATION_TIME });
        const user = {
            "token" : token,
            "id":existing.id,
            "name" : existing.name ,
            "email" : existing.email ,
            "age" : existing.age
        };

        res.json({message :"login successful" , user })

    } catch (error) {
        res.status(500).json({ error: "an error has occured :" , error });
    }
}