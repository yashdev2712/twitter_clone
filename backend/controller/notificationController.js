import Notification from "../models/notificationSchema.js";

export const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notification = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "username profilePic"
            });

        await Notification.updateMany({ to: userId }, { read: true });

        return res.status(200).json(notification);
    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});

        res.status(200).json({
            message:"notification deleted successfully"
        })

    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}