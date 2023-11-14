import express from 'express';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

//Here we have first added the authenticate middleware and then we have passed a another middleware that checks if the current user is admin or not. becouse only admin are allowed to create tenants.
router
    .route('/')
    .post(authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
        userController.create(req, res, next),
    );

export default router;
