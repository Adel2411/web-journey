export default function validation (req,res,next) {
    const {content,title} = req.body;
    if (!content || !title) return res.status(400).json({message: 'content and title are required'});
    next();
}