import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
dotenv.config();
const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        // eslint-disable-next-line no-console
        console.log('MongoDB Connected for seeding...');
        await User.deleteMany({ email: 'admin@example.com' });
        const adminUser = new User({
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        });
        await adminUser.save();
        // eslint-disable-next-line no-console
        console.log('Admin user seeded successfully!');
        // eslint-disable-next-line no-console
        console.log('Email: admin@example.com');
        // eslint-disable-next-line no-console
        console.log('Password: password123');
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error seeding data:', error);
    }
    finally {
        await mongoose.disconnect();
        // eslint-disable-next-line no-console
        console.log('MongoDB disconnected.');
        process.exit();
    }
};
seedAdmin();
