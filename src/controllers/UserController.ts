import { Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest } from '../types';
import { NextFunction } from 'express-serve-static-core';

import { validationResult } from 'express-validator';

export class UserController {
    constructor(private userService: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
            });
        }
        const { firstName, lastName, email, password, tenantId, role } =
            req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantId,
            });
            return res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAll();
            res.status(201).json({ users });
        } catch (error) {
            next(error);
        }
    }
    async getOne(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const users = await this.userService.getOne(Number(id));
            res.status(201).json({ users });
        } catch (error) {
            next(error);
        }
    }
}
