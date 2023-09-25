import express from 'express';
const router = express.Router();

import AuthController from '../controllers/AuthController';

const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));

export default router;
