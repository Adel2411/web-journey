import { verifyJWT } from "../utils/jwt.js";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({ message: "Token is missing" });
    }
    try {
        const decoded = verifyJWT(token);
        if (!decoded) {
            return res.status(401).send({ message: "Invalid token" });
        }
        req.user = decoded;
    } catch (error) {
        return res.status(401).send({ message: "Not Authorized" });
    }
    next();

}