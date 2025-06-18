export function addTimestamps(req, res, next) {
    const now = new Date().toISOString();
    req.body.createdAt = now; // date of creation 
    req.body.updatedAt = now; // date of modification (PUT)
    next(); 
}

// for PUT requests (update updatedAt)
export function updateTimestamp(req, res, next) {
    req.body.updatedAt = new Date().toISOString(); // date of modification (PUT)
    next();
}