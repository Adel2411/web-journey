export default function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const headers = JSON.stringify(req.headers);
  const body = req.body && Object.keys(req.body).length > 0? JSON.stringify(req.body): "undefined";

  console.log(`[${timestamp}] ${method} ${url} - Headers: ${headers} - Body: ${body}`);
  next();
}
