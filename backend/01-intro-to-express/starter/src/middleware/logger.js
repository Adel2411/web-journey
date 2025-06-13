export default function logger(req, res, next) {
  console.log("timestamp: ",new Date().toISOString())
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  
  next();
}
