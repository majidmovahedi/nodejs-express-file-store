import { body, param } from 'express-validator';

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
];

export const blogUpdateSchema = [
    body('title').optional().notEmpty().withMessage('Title Cant be Null!'),
    body('title')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Title Cant be less Than 5 Characters!'),

    body('content').optional().notEmpty().withMessage('Content Cant be Null!'),
    body('content')
        .optional()
        .isLength({ min: 20 })
        .withMessage('Content Cant be less Than 20 Characters!'),
    body('categoryId')
        .optional()
        .notEmpty()
        .withMessage('Category ID Cant be Null!'),

    // body('imageurl')
    //     .optional()
    //     .custom((value, { req }) => {
    //         if (validUrl.isUri(value)) {
    //             return value === req.body.imageurl;
    //         }
    //     })
    //     .withMessage('Invalid Url'),
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

export const adminUserRegisterSchema = [
    body('fullname').notEmpty().withMessage('Please Enter Fullname'),
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
    body('password').notEmpty().withMessage('Please Enter Password'),
    body('is_active').isBoolean().withMessage('Please Enter Boolean!'),
    body('type').isBoolean().withMessage('Please Enter Boolean Admin Type!'),
];

export const userForgetPasswordSchema = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
];

export const newPasswordSchema = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
    body('code')
        .isLength({ min: 4, max: 4 })
        .withMessage('Code Must be Four digits!'),
    body('code').isNumeric().withMessage('Please Enter The Number Correctly!'),
    body('password').notEmpty().withMessage('Please Enter Password'),
];

export const userChangePasswordSchema = [
    body('password').notEmpty().withMessage('password Cant be Null!'),
    body('newPassword').notEmpty().withMessage('new password Cant be Null!'),
    body('repeatNewPassword')
        .notEmpty()
        .withMessage('repeat new password Cant be Null!'),
];

export const adminChangePasswordSchema = [
    body('newPassword').notEmpty().withMessage('new password Cant be Null!'),
    body('repeatNewPassword')
        .notEmpty()
        .withMessage('repeat new password Cant be Null!'),
];

export const adminUserUpdateSchema = [
    body('fullname').optional().notEmpty().withMessage('Please Enter Fullname'),
    body('email').optional().notEmpty().withMessage('Email Cant be Null!'),
    body('email').optional().isEmail().withMessage('Please Enter Valid Email!'),
    body('password').optional().notEmpty().withMessage('Please Enter Password'),
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('Please Enter Boolean!'),
    body('type')
        .optional()
        .isBoolean()
        .withMessage('Please Enter Boolean Admin Type!'),
];

export const userResendSchema = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
];

export const userVerifySchema = [
    body('email').notEmpty().withMessage('Email Cant be Null!'),
    body('email').isEmail().withMessage('Please Enter Valid Email!'),
    body('code')
        .isLength({ min: 5, max: 5 })
        .withMessage('Code Must be Five digits!'),
    body('code').isNumeric().withMessage('Please Enter The Number Correctly!'),
];

export const userUpdateSchema = [
    body('fullname')
        .optional()
        .notEmpty()
        .withMessage('FullName Cant be Null!'),
];

export const productSchema = [
    body('title').notEmpty().withMessage('Title Cant be Null!'),
    body('title')
        .isLength({ min: 5 })
        .withMessage('Title Cant be less Than 5 Characters!'),

    body('content').notEmpty().withMessage('Content Cant be Null!'),
    body('content')
        .isLength({ min: 20 })
        .withMessage('Content Cant be less Than 20 Characters!'),
    body('categoryId').notEmpty().withMessage('Category ID Cant be Null!'),
    body('price').notEmpty().withMessage('Price Cant be Null!'),
    body('price').isNumeric().withMessage('Please Enter The Price Correctly!'),

    // body('imageurl').notEmpty().withMessage('Please Upload image'),

    // body('fileurl')
    //     .custom((value, { req }) => {
    //         if (validUrl.isUri(value)) {
    //             return value === req.body.fileurl;
    //         }
    //     })
    //     .withMessage('Invalid Url'),
];

export const productUpdateSchema = [
    body('title').optional().notEmpty().withMessage('Title Cant be Null!'),
    body('title')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Title Cant be less Than 5 Characters!'),

    body('content').optional().notEmpty().withMessage('Content Cant be Null!'),
    body('content')
        .optional()
        .isLength({ min: 20 })
        .withMessage('Content Cant be less Than 20 Characters!'),
    body('categoryId')
        .optional()
        .notEmpty()
        .withMessage('Category ID Cant be Null!'),
    body('price').optional().notEmpty().withMessage('Price Cant be Null!'),
    body('price')
        .optional()
        .isNumeric()
        .withMessage('Please Enter The Price Correctly!'),

    // body('imageurl').optional().notEmpty().withMessage('Please Upload image'),

    // body('fileurl')
    //     .optional()
    //     .custom((value, { req }) => {
    //         if (validUrl.isUri(value)) {
    //             return value === req.body.fileurl;
    //         }
    //     })
    //     .withMessage('Invalid Url'),
];
