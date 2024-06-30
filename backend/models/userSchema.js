import mongoose, { Types } from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, fullname: {
        type: String,
        required: true,
    }, email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    }, followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }], following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }], profilePic: {
        type: String,
        default: ""
    }, coverPic: {
        type: String,
        default: ""
    }, bio: {
        type: String,
        default: ""
    }, likedPost: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]
})

const User = mongoose.model("User", userSchema);

export default User;