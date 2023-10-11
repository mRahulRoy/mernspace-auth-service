import { checkSchema } from 'express-validator';
// export default [body("email").notEmpty().withMessage("email field is required!")]

export default checkSchema({
    email: {
        errorMessage: 'email field is required!',
        notEmpty: true,
        trim: true,
        isEmail: { errorMessage: 'Email is invalid' },
    },
    firstName: {
        errorMessage: 'firstName field is required!',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: 'lastName field is required!',
        notEmpty: true,
        trim: true,
    },
    password: {
        trim: true,
        errorMessage: 'Password is required!',
        notEmpty: true,
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: 'Password length should be at least 8 chars!',
        },
    },
});
