import express, { Request, RequestHandler, Response } from 'express';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import createUserValidator from '../validators/create-user-validator';
import { CreateUserRequest } from '../types';
import { NextFunction } from 'express-serve-static-core';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

//Here we have first added the authenticate middleware and then we have passed a another middleware that checks if the current user is admin or not. becouse only admin are allowed to create tenants.
router
    .route('/')
    .post(
        authenticate as RequestHandler,
        canAccess([Roles.ADMIN]),
        createUserValidator,
        (req: CreateUserRequest, res: Response, next: NextFunction) =>
            userController.create(req, res, next) as unknown as RequestHandler,
    );

router
    .route('/')
    .get(
        authenticate as RequestHandler,
        canAccess([Roles.ADMIN]),
        (req: Request, res: Response, next: NextFunction) =>
            userController.getAll(req, res, next) as unknown as RequestHandler,
    );

router
    .route('/:id')
    .get(
        authenticate as RequestHandler,
        canAccess([Roles.ADMIN]),
        (req: Request, res: Response, next: NextFunction) =>
            userController.getOne(req, res, next) as unknown as RequestHandler,
    );

export default router;
