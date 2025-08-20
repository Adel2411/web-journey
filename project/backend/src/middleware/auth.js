import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		const isMatch = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(401).json({ err: true, msg: "Invalid token" });
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json({ err: true, msg: "Invalid token" });
	}
};

export default authToken;
