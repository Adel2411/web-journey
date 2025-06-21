import posts from "../data/posts.js";


//get all the post or get the post by the name of the author

export const getPosts = (req,res)=>{
  const {author} = req.query


  let filteredPosts = [...posts]

  if(author === "" ){
     return  res.status(404).json({success:false,msg:"please entre the author's name"})
 
}
  else if(!author){
    return  res.status(200).json({success:true,data:posts})

  }
  
       
 filteredPosts = filteredPosts.filter((post)=>{
    return post.author.toLowerCase().startsWith(author.toLowerCase())

  })
  console.log(filteredPosts)
  if(filteredPosts.length === 0){
    return res.status(404).json({success : false, msg:`${author} did not post anything yet`})
  }
 else {
res.status(200).json({success:true,data:filteredPosts})
 } 
 
}

//get the post by the id

export const getPostById = (req,res)=>{
  const {id} = req.params
  const post = posts.find((post)=>post.id === Number(id))
  if (!post){
    return res.status(404).json({success:false,msg:'post not find'})
  }
  else{
    res.status(200).json({success:true,data:post})
  }
  
}





//create "Post"

export const createPost = (req,res)=>{
  const newPost = req.body
  
  const newId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;

  const postWithId = {
    id: newId,
    ...newPost
  };
  posts.push(postWithId);
   res.status(201).send({success : true , data:posts})
  
}



//update "Put"


export const updatePost = (req,res)=>{
  const {id} =req.params
  const {title,content,author} = req.body
  const updatedPost = posts.find((updatedPost)=>
  updatedPost.id === Number(id))
  console.log(updatedPost)
if (!updatedPost){
  return res.status(404).json({success:true,msg:'please provide data'})
}
const newPosts = posts.map((updatedPost)=>{
  if(updatedPost.id === Number(id)){
    if (title !== undefined){
      updatedPost.title = title
    }
    if(content !== undefined){
        updatedPost.content = content
    }
    if(author !== undefined){
        updatedPost.author = author
    }
    
  }
  return updatedPost
})
  res.status(200).json({success:true,data:newPosts})
}



export const deletePost = (req,res)=>{
  const {id} = req.params
  const deletedPost = posts.find((deletedPost)=> deletedPost.id === Number(id))
  console.log(deletedPost)
  if(!deletedPost){
    return res.status(404).json({success : false,msg:'the post doesnot exist'})
  }
  const newPosts = posts.filter((deletedPost)=> deletedPost.id !== Number(id))
  res.status(200).json({success:true,data:newPosts})
}