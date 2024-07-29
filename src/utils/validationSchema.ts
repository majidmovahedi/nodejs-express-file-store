import { body } from 'express-validator'

export const categorySchema  = [
    body('title').notEmpty().withMessage('Category Cant be Null!'),
  ]
