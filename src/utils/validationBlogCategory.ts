// import { NextFunction, Request , Response } from "express";
// import { body , validationResult } from "express-validator";


// async function blogCategoryValidationRules (req: Request , res: Response , next: NextFunction) {

//     // const myValidationResult = validationResult.withDefaults();
//     // const myValidationResult = validationResult(req);

//     await body('title','Category Cant be Null').notEmpty().run(req);
//     await body('title','This Category is Already Exist!').exists().run(req);

//     // if (myValidationResult.isEmpty()) {
//     //     return next()
//     // }
//     // return res.send({ errors: myValidationResult.array() })
// }

// export default blogCategoryValidationRules;

// import { Joi } from 'express-joi-validations';

// export const schema = Joi.object({
//   title: Joi.string().required(),
// });

import { body } from 'express-validator'

export const schema  = [
    // body('title', 'Category Cant be Null!').not().isEmpty(),
    // body('title', 'Category Cant be Null!').notEmpty(),
    // body('title', 'This Category is Already Exist!').exists(),
    body('title').notEmpty().withMessage('Category Cant be Null!'),
  ]
