import { Config } from '../config';

export const Roles = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    MANAGER: 'manager',
} as const;

export const firstAdmin = {
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin001@gmail.com',
    password: Config.FIRST_ADMIN_PASSWORD,
};
