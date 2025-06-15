export default function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const headers = JSON.stringify(req.headers);

  let body = "undefined";

  if (["POST", "PUT"].includes(method)) {
    if (req.body && Object.keys(req.body).length > 0) {
      body = JSON.stringify(req.body);
    }
  }

  console.log(`[${timestamp}] ${method} ${url} - Headers: ${headers} - Body: ${body}`);
  next();
}
