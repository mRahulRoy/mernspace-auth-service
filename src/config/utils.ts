import { User } from '../entity/User';
import { AppDataSource } from './data-source';
import logger from './logger';
import { UserData } from '../types';
import { Roles } from '../constants';
import Bcrypt from 'bcryptjs';

//Creating a initial admin in the system who will create another admins or users.
export const instantiateAdminUser = async ({
    email,
    password,
    firstName,
    lastName,
}: UserData) => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const isAdmin = await userRepository.findOne({ where: { email } });
        if (isAdmin) {
            //no need to create a new admin user since its already there.
            return false;
        } else {
            const saltRounds = 10;
            const hashedPassword = await Bcrypt.hash(password, saltRounds);

            const data = {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: Roles.ADMIN,
            };

            await userRepository.save(data);
            logger.info('Initial Admin created');
        }
    } catch (error) {
        logger.error('Error occured while creating initial admin', error);
        process.exit(1);
    }
};
