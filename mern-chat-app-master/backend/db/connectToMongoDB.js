import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI; // Fetching MongoDB URI from .env
        console.log(mongoURI,process.env)

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw new Error("Failed to connect to MongoDB");
    }
};

export default connectToMongoDB;
