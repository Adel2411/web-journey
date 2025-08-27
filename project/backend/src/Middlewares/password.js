import passwordValidator from 'password-validator';

const schema = new passwordValidator();

schema
.is().min(8)                                  
.is().max(20)                                 
.has().uppercase()                             
.has().lowercase()                             
.has().digits(2)                                 
.has().not().spaces();

export default (req, res, next) => {
    const { password } = req.body;

    if (!schema.validate(password)) {
        return res.status(400).json({
            error: `Password does not meet complexity requirements: ${schema.validate(password, { list: true })}`
        });
    }

    next();
};
