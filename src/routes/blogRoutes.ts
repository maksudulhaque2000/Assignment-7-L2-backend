import { Router } from 'express';
import Blog from '../models/blogModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Revalidate helper function
const revalidate = async (path: string) => {
  const frontendUrl = process.env.FRONTEND_URL;
  const token = process.env.REVALIDATION_TOKEN;

  if (!frontendUrl || !token) {
    // eslint-disable-next-line no-console
    console.error('Frontend URL or revalidation token is not set in backend .env');
    return;
  }
  const encodedToken = encodeURIComponent(token);
  try {
    await fetch(`${frontendUrl}/api/revalidate?path=${path}&token=${encodedToken}`);
    // eslint-disable-next-line no-console
    console.log(`Revalidation signal sent for path: ${path}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send revalidation signal for ${path}:`, error);
  }
};

// --- Public Routes ---
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Protected Routes ---

// CREATE a new blog
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    
    // Revalidate public pages after creating a new blog
    await revalidate('/blogs');
    await revalidate(`/blogs/${newBlog._id}`);
    
    res.status(201).json(newBlog);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a blog
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });

    // Revalidate public pages after updating a blog
    await revalidate('/blogs');
    await revalidate(`/blogs/${req.params.id}`);

    res.json(updatedBlog);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a blog
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
    
    // Revalidate public pages after deleting a blog
    await revalidate('/blogs');
    
    res.json({ message: 'Blog deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;