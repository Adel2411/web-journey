
export default function noteValidator(req, res, next){
    const {title, content, isPublic} = req.body;

    if(!title || typeof title !== 'string' || title.trim().length <3 || title.trim().length > 100){
        return res.status(400).json({ error: "Title is required ( at least 3 char)!" });
    }

    if(!content || typeof content !== 'string' || content.trim().length < 6){
        return res.status(400).json({ error: "Content is required ! ( at least 6 char)" });
    }
   
    next();
}