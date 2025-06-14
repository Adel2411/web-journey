export default function logger(req, res, next) {
  console.log("Request url:", req.url);
  console.log("Request method:", req.method);
  console.log("Request Headers:", req.headers);
  console.log("Request body:", req.body);
  next();
}
