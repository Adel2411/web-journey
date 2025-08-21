import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  const token = authHeader.split(" ")[1]; // take only the token part

  try {
    const decoded = jwt.verify(token, jwtSecret); 
    req.user = decoded; 

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
