// Export a default middleware function named logger for logging request details
export default function logger(req, res, next) {
  // Log the current timestamp in ISO format
  console.log("timestamp: ", new Date().toISOString());
  // Log the HTTP method of the incoming request (e.g., GET, POST)
  console.log("Request Method:", req.method);
  // Log the URL of the incoming request
  console.log("Request URL:", req.url);
  // Log the headers of the incoming request
  console.log("Request Headers:", req.headers);
  // Log the body of the incoming request (if any else will be undefined)
  console.log("Request Body:", req.body);
  
  // Call the next middleware function in the stack to continue request processing
  next();
}