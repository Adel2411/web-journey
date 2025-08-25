export default function logger(req, res, next) {
  console.log("Request Headers:", req.headers);
  next();
}
