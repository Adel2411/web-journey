
export default function noteValidator(req, res, next){
    const {title, content, isPublic} = req.body;

    if(!title || typeof title !== 'string' ){
        return res.status(400).json({ error: "Title is required !" });
    }

    if(!content || typeof content !== 'string' || content.trim().length < 6){
        return res.status(400).json({ error: "Content is required ! ( at least 6 char)" });
    }
   
    next();
}