import { Response } from 'express';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';

export class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, password, email } = req.body;
        await this.userService.create({ firstName, lastName, password, email });

        res.status(201).json({
            message: 'all success',
        });
    }
}

export default AuthController;
