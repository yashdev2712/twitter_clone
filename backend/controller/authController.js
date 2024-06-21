import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/genToken.js";

export const signup = async (req, res) => {
    try {

        const { username, fullname, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(401).json({
                Error: " Already a existing user"
            })
        }

        if (password.length < 6) {
            return res.status(402).json({
                Error: "password must be of 6 character"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if (newUser) {
            genToken(newUser._id, res);
            res.status(200).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profilePic: newUser.profilePic,
                coverPic: newUser.coverPic
            })
        }
    } catch (error) {
        console.error("Error:", error.message);
    }

}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        genToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out succesfully" })
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            Error: "Error in logout controller"
        })

    }

}


export const getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
     }
    catch(error){}
}