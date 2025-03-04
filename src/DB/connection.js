import mongoose from "mongoose";
const connectDB = async () => {
    try {   
        await mongoose.connect(process.env.DB_URI)
        console.log("connected db");
    }
    catch (error) {
        console.error({message: "failed to connect DB", error:error.message})
    }
}
export default connectDB