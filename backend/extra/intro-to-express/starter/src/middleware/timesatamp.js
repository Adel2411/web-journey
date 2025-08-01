export default function timestamp (req,res,next) {
  const time = new Date().toISOString();  
  console.log( time);
  next();
}