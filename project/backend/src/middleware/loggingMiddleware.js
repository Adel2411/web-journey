/*  Middleware for logging requests and tracking timestamps*/

export const requestLogger = (req, res, next) => {
  // Add timestamp to request object
  req.requestTime = new Date();

  // Log the request method and URL
  console.log(`${req.method} ${req.url} at ${req.requestTime.toISOString()}`);

  next();
};
