import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, text: {
        type: String,

    }, img: {
        type: String
    }, likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);

export default Post;