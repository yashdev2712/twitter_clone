import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./db/db.js";
import  authRoutes from "./Routes/authRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hii there");
})

app.use("/api/auth",authRoutes);


app.listen(PORT, () => {
    console.log("server connected to PORT:", PORT);
    connectToDb();
})