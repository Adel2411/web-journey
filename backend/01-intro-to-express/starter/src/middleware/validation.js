const { body } = require('express-validator');

exports.Validator = [
    body('title').notEmpty().withMessage('Le titre est requis'),
    body('description').notEmpty().withMessage('la discription est requise'),
    body('author').notEmpty().withMessage('Le nom d\'auteur est requis' )
]