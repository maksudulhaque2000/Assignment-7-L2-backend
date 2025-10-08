import { Router } from 'express';
import Blog from '../models/blogModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

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
    res.json({ message: 'Blog deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
