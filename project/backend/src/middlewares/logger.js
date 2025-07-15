export default function logger(req, res, next) {
  const logMessage = `[${new Date().toISOString()}] ${req.method} /api/notes - Headers: ${JSON.stringify(req.headers)} - Body: ${JSON.stringify(req.body)}`
  console.log(logMessage)
  next();
}