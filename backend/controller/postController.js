import User from "../models/userSchema.js";
import Post from "../models/postSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        if (!text && !img) {
            return res.status(400).json({
                message: "A post have text or image"
            })
        }


        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }

        const newPost = await Post.create({
            user: userId,
            text,
            img
        })

        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);

    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!req.user || post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgParts = post.img.split("/");
            const imgId = imgParts[imgParts.length - 1].split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        // Ensure that only one response is sent in case of an error
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
        console.log(error);
    }
};

export const likeorUnlikePost = async (req, res) => {

}

export const commentPost = async (req, res) => {

}