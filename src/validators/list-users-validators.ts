import { checkSchema } from 'express-validator';

export const customFeildSantizer = (value: unknown) => {
    return value ?? '';
};

export default checkSchema(
    {
        q: {
            trim: true,
            customSanitizer: {
                options: customFeildSantizer,
            },
        },
        role: {
            customSanitizer: {
                options: customFeildSantizer,
            },
        },
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    return isNaN(parsedValue) ? 1 : ~~parsedValue;
                },
            },
        },
        perPage: {
            customSanitizer: {
                options: (value) => {
                    const parsedValue = Number(value);
                    return isNaN(parsedValue) ? 6 : ~~parsedValue;
                },
            },
        },
    },
    ['query'],
);
