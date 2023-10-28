import { checkSchema } from 'express-validator';
// export default [body("email").notEmpty().withMessage("email field is required!")]

export default checkSchema({
    email: {
        errorMessage: 'email field is required!',
        notEmpty: true,
        trim: true,
        isEmail: { errorMessage: 'Email is invalid' },
    },
    password: {
        trim: true,
        errorMessage: 'Password is required!',
        notEmpty: true,
    },
});
