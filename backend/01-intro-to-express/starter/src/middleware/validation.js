export default function validator (req, res, next) {
    const { title, content, author } = req.body;

    if (req.method === 'POST') {
        if (typeof title === 'undefined' || typeof content === 'undefined' || typeof author === 'undefined') {
            return res.status(400).json({     
            error:  "Validation failed",
            message: "title, content, and author are all required." });
        }
        else if (typeof title !== 'string' && typeof title !== 'undefined'
             || typeof content !== 'string' && typeof content !== 'undefined'
             || typeof author !== 'string' && typeof author !== 'undefined') {
            return res.status(400).json({ 
                error:  "Validation failed",
                message: 'title, content, and author must all be strings' });
        }
        else if (title == "" || content == ""|| author == "") {
            return res.status(400).json({ 
                error:  "Validation failed",
                message: 'title, content, and author cannot be empty strings' });
        }
    }

    if (req.method === 'PUT') {
        if (typeof title === 'undefined' && typeof content === 'undefined' && typeof author === 'undefined') {
            return res.status(400).json({ 
                error:  "Validation failed",
                message: 'at least the title, content, or author must be provided' });
        }
        else if (typeof title !== 'string' && typeof title !== 'undefined'
             || typeof content !== 'string' && typeof content !== 'undefined'
             || typeof author !== 'string' && typeof author !== 'undefined') {
            return res.status(400).json({ 
                error:  "Validation failed",
                message: 'title, content, and author must all be strings' });
        }
        else if (title == "" || content == ""|| author == "") {
            return res.status(400).json({ 
                error:  "Validation failed",
                message: 'title, content, and author cannot be empty strings' });
        }
    }
    next();
}