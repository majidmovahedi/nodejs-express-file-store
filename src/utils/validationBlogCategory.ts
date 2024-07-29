import { body } from 'express-validator'

export const schema  = [
    // body('title', 'Category Cant be Null!').not().isEmpty(),
    // body('title', 'Category Cant be Null!').notEmpty(),
    // body('title', 'This Category is Already Exist!').exists(),
    body('title').notEmpty().withMessage('Category Cant be Null!'),
  ]
