import express from 'express';
const router = express.Router();

import AuthController from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post('/register', (req, res) => authController.register(req, res));

export default router;
