// src/routes/auth.ts
import express from "express";
import authMiddleware from "@/middleware/auth.middleware";
import * as AuthController from "@/controllers/auth.controller";

const router = express.Router();

// POST /api/auth/login
router.post("/login", AuthController.login);

// POST /api/auth/registration
router.post("/registration", AuthController.register);

// GET /api/auth/me
router.get("/me", authMiddleware, AuthController.getCurrentUser);

// POST /api/auth/logout
router.post("/logout", AuthController.logout);

export default router;
