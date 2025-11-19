// src/routes/auth.ts
import express from 'express';
import authMiddleware from '../middleware/auth.middleware'; // パスを修正
import * as AuthController from '../controllers/auth.controller'; // パスを修正
import { validate } from '../middleware/validator';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = express.Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), AuthController.login);

// POST /api/auth/registration
router.post(
  '/registration',
  validate(registerSchema),
  AuthController.register
);

// GET /api/auth/me
router.get('/me', authMiddleware, AuthController.getCurrentUser);

// POST /api/auth/logout
router.post('/logout', AuthController.logout);

export default router;
