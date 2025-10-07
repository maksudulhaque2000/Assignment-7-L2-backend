import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL as string);
    
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error: unknown) {

    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      // eslint-disable-next-line no-console
      console.error('An unknown error occurred while connecting to MongoDB', error);
    }
    
    process.exit(1);
  }
};

export default connectDB;