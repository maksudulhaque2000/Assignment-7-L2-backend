import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        console.log('Already connected to MongoDB.');
        return;
    }
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not defined in environment variables.');
        }
        await mongoose.connect(dbUrl);
        console.log('MongoDB Connected Successfully.');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while connecting to MongoDB', error);
        }
        process.exit(1);
    }
};
export default connectDB;
