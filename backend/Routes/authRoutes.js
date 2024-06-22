import express from "express";
import { signup, login, logout,getMe } from "../controller/authController.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me",middleware,getMe);

export default router;