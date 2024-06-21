import express from "express";
import { signup, login, logout } from "../controller/authController.js"

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me",protectedRoute,getMe)

export default router;