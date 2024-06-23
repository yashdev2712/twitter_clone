import User from "../models/userSchema.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password");
        console.log(user);
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

        if (id === req.user._id) {
            return res.status(400).json({
                message: "You can't follow or unfollow yourself"
            })
        }

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            //unfollow 
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

        } else {
            //follow 
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
        }



    } catch (error) {
        console.error("Error occured in followOrUnfollow:", error.message);
        return res.status(500).json({
            message: error.message
        })
    }

}

export const updateProfile = async (req, res) => {

}