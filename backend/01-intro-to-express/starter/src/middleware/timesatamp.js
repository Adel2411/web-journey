export const addTimestamp = (req, res, next) => {
    const timestamp = new Date().toISOString();
    if (req.method === 'POST') {
        req.body.createdAt = timestamp;
        req.body.updatedAt = timestamp;
    }
    if (req.method === 'PUT') {
        req.body.updatedAt = timestamp
    }
    next();
}