export default function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const { method, path, headers, body} = req;
  console.log('[${timestamp}] ${method} ${path} - Headers: ${JSON.stringify(headers)} -Body: ${JSON.stringify(body)}');
  next();
}
