import express from "express";
import middleware from "../middleware/middleware.js";
import {createPost,deletePost,likeorUnlikePost,commentPost} from "../controller/postController.js";


const router = express.Router();

router.post("/create",middleware,createPost);
router.delete("/delete/:id",middleware,deletePost);
router.post("/like/:id",middleware,likeorUnlikePost);
router.post("/comment/:id",middleware,commentPost);

export default router;