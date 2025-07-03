const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const headers = req.headers;
  const body = req.body;

  console.log(`[${timestamp}] ${method} ${path} - Headers: ${JSON.stringify(headers)} - Body: ${JSON.stringify(body)}`);
  
  next(); // Continue to next middleware
};

export default logger;
