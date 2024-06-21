import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGOOSE_URI);
        console.log("Connected to Database")
    }
    catch (error) {
        console.error("Error:", error.message)
    }
}

export default connectToDb;