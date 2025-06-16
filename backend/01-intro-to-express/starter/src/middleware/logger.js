const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.originalUrl;
  const headers = JSON.stringify(req.headers, null, 2);
  const body =
    req.body && Object.keys(req.body).length > 0
      ? JSON.stringify(req.body, null, 2)
      : "undefined";

  console.log(`[${timestamp}] ${method} ${path}`);
  console.log(`Headers: ${headers}`);
  console.log(`Body: ${body}`);
  console.log("---------------------------");

  next();
};

export default logger;
