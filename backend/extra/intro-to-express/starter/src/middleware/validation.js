export const validationPost = (req,res,next)=>{
  const {title,content,author} = req.body
  let missingFields =[]
  if (!title || typeof title !== 'string' || title.trim() == ''){
    missingFields.push('title')
  }
  if (!content || typeof content !== 'string' || content.trim() == ''){
    missingFields.push('content')
  }
  if (!author|| typeof author !== 'string' || author.trim() == ''){
    missingFields.push('author')
  }

  if (missingFields.length>0){
   return res.status(400).json({  error: "Validation failed",
  message: `Missing required fields: ${missingFields.join(', ')}`})
  }

  next()
}



export const validationUpdate = (req,res,next)=>{
    const {title,content,author} = req.body

    const isValid =
    (title && typeof title === 'string' && title.trim() !== "" ||
       content && typeof content === 'string' && content.trim() !== "" ||
      author && typeof author === 'string' && author.trim() !== "")
        
    if(isValid){
      return next()
    }
    else{
      return res.status(400).json({  error: "Validation failed",
  message: "At least one non-empty field (title, content, or author) must be provided"})
    }
       
    }
