import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password, role }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (user) {
            const err = createHttpError(400, 'email already exists!');
            throw err;
        }

        //Hashing the password
        const saltRounds = 10;
        const hasedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                password: hasedPassword,
                email,
                role,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store data in the database',
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
}
