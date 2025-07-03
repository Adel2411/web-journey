export default function createdAt(req , res , next){
  const time = new Date();
  req.body.createdAt = time;
  next();
}

export function updatedAt(req , res , next){
  const time = new Date();
  req.body.updatedAt = time;
  next();
}