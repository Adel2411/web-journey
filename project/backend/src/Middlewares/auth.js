import jwt from 'jsonwebtoken';

function authorize(req, res, next) {

        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing token' });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = decoded; 

            next();
        } catch {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
export default authorize;