import { checkSchema } from 'express-validator';
// export default [body("email").notEmpty().withMessage("email field is required!")]

export default checkSchema({
    email: {
        errorMessage: 'email field is required!',
        notEmpty: true,
        trim: true,
    },
});
