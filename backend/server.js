import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import postRoutes from "./Routes/postRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";

import connectToDb from "./db/db.js";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hii there");
})

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification",notificationRoutes);


app.listen(PORT, () => {
    console.log("server connected to PORT:", PORT);
    connectToDb();
})