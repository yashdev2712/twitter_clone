import User from "../models/userSchema.js"
import jwt from "jsonwebtoken";

const middleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized: no token provided"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                error: "invalid token"
            })
        }

        const user = await User.findById(decode.userId).select("-password");
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error occured:", error.message);
        return res.status(500).json({
            Error: "internal server error"
        })
    }

}

export default middleware