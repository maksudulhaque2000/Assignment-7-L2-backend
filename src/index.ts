import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/projects', projectRoutes);

  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running locally on port ${PORT}`);
    });
  }
}

main();

export default app;