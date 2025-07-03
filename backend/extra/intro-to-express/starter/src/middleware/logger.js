export default function logger(req, res, next) {
  const time= new Date();
  const logger = {
    "method": req.method ,
    "path": req.path ,
    "headers": req.headers ,
    "body": req.body ,
    "time": time
  };
  console.log(logger);
  next();
}