import emailFormat from "../utils/emailFormat.js";
import userFormatter from "../utils/userFormatter.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";

const registerUser = async (req, res) => {
	let { email, password, confirmPassword, name, age } = req.body;
	email = email.trim();
	password = password.trim();
	confirmPassword = confirmPassword.trim();
	name = name.trim();

	if (!email || !password || !confirmPassword || !name || !age) {
		return res
			.status(400)
			.json({ err: true, msg: "Please include all necessary credentials" });
	} else if (password != confirmPassword) {
		return res.status(400).json({ err: true, msg: "Passwords don't match" });
	} else if (password.length < 6) {
		return res
			.status(400)
			.json({ err: true, msg: "Password must be greater than 6 characters" });
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

		const user = await prisma.user.create({
			data: { email, password: hashedPass, name, age },
		});

		const token = jwt.sign(
			{ name, id: user.id, email },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			},
		);

		return res.status(201).json({
			message: "User registered successfully",
			data: { user: userFormatter(user), token },
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({ err: true, msg: "Internal server error" });
	}
};

const login = async (req, res) => {
	let { email, password } = req.body;
	email = email.trim();
	password = password.trim();

	if (!email || !password) {
		return res
			.status(400)
			.json({ err: true, msg: "Please include all necessary credentials" });
	}

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({
				err: true,
				msg: "No user with this email address",
			});
		}

		const isMatch = bcrypt.compareSync(password, user.password);

		if (isMatch) {
			const token = jwt.sign(
				{ name: user.name, id: user.id, email },
				process.env.JWT_SECRET,
				{
					expiresIn: "1h",
				},
			);

			return res.status(201).json({
				message: "Login successful",
				data: { user: userFormatter(user), token },
			});
		}
		return res.status(400).json({ err: true, msg: "Invalid credentials" });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ err: true, msg: "Internal server error" });
	}
};

export default { registerUser, login };
