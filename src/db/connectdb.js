import mongoos from "mongoose";

const connectDB = async (DB_URL) => {
    try {
        // const DB_OPTIONS = {
        //     dbName: process.env.DB_NAME
        // };
        await mongoos.connect(DB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("error is connectdb function")
    };
};

export default connectDB;