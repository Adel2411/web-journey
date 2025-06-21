
export const TimestampPost = (req,res,next)=>{
    const now = new Date().toISOString()
    req.body.createdAt = now
    req.body.updatedAt = now
  next()
}

export const TimestampUpdate = (req,res,next)=>{
  const update = new Date().toISOString()
  req.body.updatedAt = update
  next()
}