import { body } from 'express-validator';
import validUrl from "valid-url";

export const categorySchema  = [
    body('title').notEmpty().withMessage('Category Cant be Null!'),
]

export const blogSchema  = [
    body('title').notEmpty().withMessage('Title Cant be Null!'),
    body('title').isLength({min: 5}).withMessage('Title Cant be less Than 5 Characters!'),

    body('content').notEmpty().withMessage('Content Cant be Null!'),
    body('content').isLength({min: 20}).withMessage('Content Cant be less Than 20 Characters!'),

    body('imageurl').custom((value, { req }) => {
        if (validUrl.isUri(value)){
            return value === req.body.imageurl;
        }
    }).withMessage('Invalid Url'),

    // body('title').custom((value, { req }) => {
    //     if (typeof value === 'string'){
    //         return value === req.body.title;
    //     }
    // }).withMessage('Title Must be String!'),

    // body('title').custom(async value => {
    //     const existingUser = await Users.findUserByEmail(value);
    //     if (existingUser) {
    //       throw new Error('E-mail already in use');
    //     }
    //   }),
]

export const userSchema  = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
]

export const passwordSchema =[
    body('password').notEmpty().withMessage('password Cant be Null!'),
    body('newPassword').notEmpty().withMessage('new password Cant be Null!'),
    body('repeatNewPassword').notEmpty().withMessage('repeat new password Cant be Null!'),
]

export const updateSchema =[
    // name null
    // email null
    // body('email').isEmail().withMessage('Please Enter Valid Email!')
]

export const userVerifySchema = [
    body('code').isLength({min: 4 , max: 4}).withMessage('Code Must be Four digits!'),
    body('code').isNumeric().withMessage('Please Enter The Number Correctly!'),
]
