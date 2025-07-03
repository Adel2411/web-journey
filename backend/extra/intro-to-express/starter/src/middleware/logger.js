export default function logger(req, res, next) {

  console.log("Request Headers:", req.headers);
  // request logs for debugging and monitoring
  const logData = {
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    userAgent: req.headers['user-agent'],
    body: req.body || null,
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify(logData, null, 2));
  next();
}
