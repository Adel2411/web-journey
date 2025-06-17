export default function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`// ${time} ${req.method} ${req.originalUrl}`);
  console.log("- Headers: ", req.headers, " - Body: ", req.body);
  next();
}
