export default function logger(req, res, next) {
  const time = new Date().toISOString();
  
  console.log(`[${time}] + ${req.method} /posts - Headers : ${JSON.stringify(req.headers)} - Body : ${req.body ? JSON.stringify(req.body) : undefined}`);
  
}
