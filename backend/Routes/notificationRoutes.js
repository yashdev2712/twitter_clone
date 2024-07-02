import express from "express";
import middleware from "../middleware/middleware.js";
import { getNotification, deleteNotification } from "../controller/notificationController.js"


const router = express.Router();

router.get("/getNotification", middleware, getNotification);
router.delete("/deleteNotification", middleware, deleteNotification);




export default router;
