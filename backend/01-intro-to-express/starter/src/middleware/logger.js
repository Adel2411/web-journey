export default function logger(req, res, next) {

  const method = req.method;
  const path = req.path;
  const headers = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body || {});
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path} - Headers: ${headers} - Body: ${body}`);

  next(); 
};

