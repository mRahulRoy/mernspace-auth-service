import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';
import logger from '../config/logger';

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (user) {
            const err = createHttpError(400, 'email already exists!');
            throw err;
        }

        try {
            //Hashing the password
            const saltRounds = 10;
            const hasedPassword = await bcrypt.hash(password, saltRounds);
            return await this.userRepository.save({
                firstName,
                lastName,
                password: hasedPassword,
                email,
                role: Roles.CUSTOMER,
            });
        } catch (err) {
            // console.log(err)
            logger.info('called');

            const error = createHttpError(
                500,
                'Failed to store data in the database',
            );
            throw error;
        }
    }
}
