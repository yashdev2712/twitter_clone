import express from "express";
import middleware from "../middleware/middleware.js";
import { getUserProfile, suggestedProfile, followOrUnfollow, updateProfile } from "../controller/userController.js";

const router = express.Router();


router.get("/profile/:username", middleware, getUserProfile);

router.get("/suggested", middleware, suggestedProfile);

router.post("/follow/:id", middleware, followOrUnfollow);

router.post("update", middleware, updateProfile);



export default router;