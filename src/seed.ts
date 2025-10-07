import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log('MongoDB Connected for seeding...');
    
    await User.deleteMany({ email: 'admin@example.com' });

    const adminUser = new User({
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
    });

    await adminUser.save();
    console.log('Admin user seeded successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit();
  }
};

seedAdmin();