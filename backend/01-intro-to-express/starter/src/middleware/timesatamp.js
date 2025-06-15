export function addTimestamp(req, res, next) {
    return new Date().toISOString();
    next();
}