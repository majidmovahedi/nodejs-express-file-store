import { body, param } from 'express-validator';
import validUrl from 'valid-url';

export const paramSchema = [
    param('id').isInt().withMessage('ID Must be an Integer'),
];

export const categorySchema = [
    body('title').notEmpty().withMessage('Category Cant be Null!'),
];

export const blogSchema = [
    body('title').notEmpty().withMessage('Title Cant be Null!'),
    body('title')
        .isLength({ min: 5 })
        .withMessage('Title Cant be less Than 5 Characters!'),

    body('content').notEmpty().withMessage('Content Cant be Null!'),
    body('content')
        .isLength({ min: 20 })
        .withMessage('Content Cant be less Than 20 Characters!'),
    body('categoryId').notEmpty().withMessage('Category ID Cant be Null!'),

    body('imageurl')
        .custom((value, { req }) => {
            if (validUrl.isUri(value)) {
                return value === req.body.imageurl;
            }
        })
        .withMessage('Invalid Url'),
];

export const userLoginSchema = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
    body('password').notEmpty().withMessage('Please Enter Password'),
];

export const userRegisterSchema = [
    body('fullname').notEmpty().withMessage('Please Enter Fullname'),
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
    body('password').notEmpty().withMessage('Please Enter Password'),
];

export const passwordSchema = [
    body('password').notEmpty().withMessage('password Cant be Null!'),
    body('newPassword')
        .optional()
        .notEmpty()
        .withMessage('new password Cant be Null!'),
    body('repeatNewPassword')
        .optional()
        .notEmpty()
        .withMessage('repeat new password Cant be Null!'),
];

export const updateSchema = [
    body('fullname')
        .optional()
        .notEmpty()
        .withMessage('FullName Cant be Null!'),
    body('email').optional().notEmpty().withMessage('Email Cant be Null!'),
    body('email').optional().isEmail().withMessage('Please Enter Valid Email!'),
];

export const commonSchema = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
    body('code')
        .optional()
        .isLength({ min: 4, max: 4 })
        .withMessage('Code Must be Four digits!'),
    body('code')
        .optional()
        .isNumeric()
        .withMessage('Please Enter The Number Correctly!'),
];
