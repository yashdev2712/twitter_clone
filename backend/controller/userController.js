import User from "../models/userSchema.js";
import Notification from "../models/notificationSchema.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        res.status(200).json(user);
    }
    catch (error) {
        console.error("error while fetching user profile:", error.message);
        return res.status(500).json({
            error: error.message
        })
    }
}


export const suggestedProfile = async (req, res) => {

    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            }, { $sample: { size: 10 } }
        ]);

        const filterUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
        const suggestedUsers = filterUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers)
    }
    catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({
            Error: "error in suggestUser"
        })
    }

}


export const followOrUnfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser) {
            return res.status(500).json({
                message: "user not found"
            })
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                message: "You can't follow or unfollow yourself"
            })
        }

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            //unfollow 
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            const newNotification = await Notification.create({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })

            res.status(200).json({ message: "User unfollowed succesfully" })

        } else {
            //follow 
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({
                message: "User followed succesfully"
            })
        }



    } catch (error) {
        console.error("Error occured in followOrUnfollow:", error.message);
        return res.status(500).json({
            message: error.message
        })
    }

}

export const updateProfile = async (req, res) => {
    const { fullname, email, username, currentPassword, newPassword, bio } = req.body;
    let { profilePic, coverPic } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ Message: "User not found" });
        }

        // Handle password update
        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ Error: "Current password is incorrect" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle profile picture update
        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            user.profilePic = uploadedResponse.secure_url;
        }

        
        if (coverPic) {
            if (user.coverPic) {
                await cloudinary.uploader.destroy(user.coverPic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverPic);
            user.coverPic = uploadedResponse.secure_url;
        }

        // Update other fields
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;

        // Save user and ensure password is not sent back
        user = await user.save();
        user.password = undefined; // or use `delete user.password;`

        return res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
