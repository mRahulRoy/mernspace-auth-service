import { Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest, UserQueryParams } from '../types';
import { NextFunction } from 'express-serve-static-core';

import { matchedData, validationResult } from 'express-validator';

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
        const validatedQuery = matchedData(req, { onlyValidData: true });

        try {
            const [users, count] = await this.userService.getAll(
                validatedQuery as UserQueryParams,
            );
            res.status(200).json({
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }
    async getOne(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const users = await this.userService.getOne(Number(id));
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}
