export default function logger(req, res, next) { //
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const headers = req.headers;
  let bodyContent;
  if (req.body) {
    bodyContent = console.log(req.body);
  } 
  else { 
    bodyContent = (console.log("undefined"));
  }

  const body = bodyContent;

  console.log(`[${timestamp}] ${method} ${url} - Headers: ${headers} - Body: ${body}`);
  
  next();
}
