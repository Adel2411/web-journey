import { addTimestamp } from "./timesatamp.js";
export default function logger(req, res, next) {
  const timestamp = addTimestamp(req, res, next);
  console.log(`// ${timestamp} ${req.method} ${req.originalUrl}`);
  console.log("- Headers: ", req.headers, " - Body: ", req.body);
  next();
}
