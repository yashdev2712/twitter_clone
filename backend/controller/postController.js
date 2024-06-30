import User from "../models/userSchema.js";
import Post from "../models/postSchema.js";
import Notification from "../models/notificationSchema.js";
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
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // Like post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = Notification.create({
                from: userId,
                to: post.user,
                type: "like",
            });


            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    }
    catch (error) {
        console.log("Error in likeOrUnlike:", error.message);
        res.status(500).json({ error: "Internal server error" })
    }

}

export const commentPost = async (req, res) => {
    try {

        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(404).json({ error: "text field is required" })
        }

        const post = await Post.findById(postId);


        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = { user: userId, text };

        post.comments.push(comment);

        await post.save();

        res.status(200).json(post);
    }
    catch (error) {
        console.log("Error in commentOnPost:", error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getAllPost = async (req, res) => {
    try { 
        
        const posts = await Post.find().sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        });


        if(posts.length===0){
            return res.status(200).json([]);
        }

        return res.status(200).json(posts);
    }
    catch (error) {
        console.log("Error in commentOnPost:", error);
        res.status(500).json({ error: "Internal server error" })
    }
}