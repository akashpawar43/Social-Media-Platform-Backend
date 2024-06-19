import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;

const connectToMongo = async () => {
    try {
        mongoose.connect(`${MONGO_URL}/social`)
        console.log("Database is connected");
    } catch (error) {
        console.log(error);
        console.log("Database is not connected");
    }
}

export default connectToMongo;
