import emailFormat from "../utils/emailFormat.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";

const registerUser = async (req, res) => {
	const { email, password, confirmPassword, name, age } = req.body;
	if (!email || !password || !name || !age) {
		return res
			.status(400)
			.json({ err: true, msg: "Please include all necessary credentials" });
	} else if (password != confirmPassword) {
		return res.status(400).json({ err: true, msg: "Passwords don't match" });
	} else if (age < 18) {
		return res.status(400).json({ err: true, msg: "Age must be 18+" });
	} else if (!emailFormat(email)) {
		return res.status(400).json({ err: true, msg: "Invalid email format" });
	}

	try {
		const isUser = await prisma.user.findUnique({
			where: { email },
		});

		if (isUser) {
			return res.status(404).json({
				err: true,
				msg: "Email already associated with another account",
			});
		}

		const salt = bcrypt.genSaltSync(10);
		const hashedPass = bcrypt.hashSync(password, salt);
		const token = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		const user = await prisma.user.create({
			data: { email, password: hashedPass, name, age },
		});

		return res
			.status(201)
			.json({ err: false, msg: "User created successfully", user, token });
	} catch (e) {
		console.log(e);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({
				err: true,
				msg: "No user with this email address",
			});
		}

		const salt = bcrypt.genSaltSync(10);
		const hashedPass = bcrypt.hashSync(password, salt);

		return res
			.status(201)
			.json({ err: false, msg: "User logged successfully", user });
	} catch (e) {
		console.log(e);
	}
};

export default { registerUser, login };
