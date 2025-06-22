import express from 'express'
import postdata from '../data/postdata.js'
export const router = express.Router();
import createdAt ,{updatedAt} from '../middlware/timestamp.js';
import validatepost from '../middlware/validation.js';
import validateNewPost from '../middlware/validation.js';

router.get('/' , (req,res) =>{
 const { author } = req.query ;
 if(!author) return res.send(postdata);
 const findposts = postdata.filter((post) =>{
    return post.author.toLowerCase() == author.toLocaleLowerCase()
 });
 res.send(findposts);
});

router.post('/' ,validateNewPost ,createdAt,updatedAt, (req,res) =>{
    console.log(req.body);
    const {body} = req;
    const newPost = { id : postdata[postdata.length - 1].id + 1 , ...body};
    postdata.push(newPost);
    res.send(postdata)
})

router.get('/:id' , (req,res) => {
  const goodId = parseInt(req.params.id) ;
  const foundId = postdata.find((post) => {
    return post.id == goodId;
  });
  if(!foundId) return res.status(404).send("post not found");
  res.send(foundId);
});

router.put('/:id' ,createdAt , updatedAt , (req,res) =>{
  const { body , params : {id}} = req ;
  const goodId = parseInt(req.params.id) ;
  if(isNaN(goodId)) return res.sendStatus(400) ;
  const foundIndex = postdata.findIndex((post) => post.id === goodId ) ;
  if(foundIndex == -1) return res.sendStatus(404);
  postdata[foundIndex] = { id : goodId , ...body};
  res.sendStatus(200);
})

router.delete('/:id' , (req,res) =>{
  const {params : {id}} = req ;
  const goodId = parseInt(req.params.id) ;
  if(isNaN(goodId)) return res.sendStatus(400) ;
  const foundIndex = postdata.findIndex((post) => post.id === goodId ) ;
  if(foundIndex == -1) return res.sendStatus(404);
  postdata.splice(foundIndex);
  res.sendStatus(200);
})

export default router ;