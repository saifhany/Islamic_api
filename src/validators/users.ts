import {check} from  "express-validator";

const  userCreateValidator = [
    check('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be a valid format'),
        check('password')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters long'),
        check('phone')
        .isLength({max:14 , min:13 })
        .withMessage('phone must be at least 13 characters long'),
] 
export  default  userCreateValidator;
