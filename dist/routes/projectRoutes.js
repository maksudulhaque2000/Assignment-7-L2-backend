import { Router } from 'express';
import Project from '../models/projectModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = Router();
// --- Public Routes ---
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// --- Protected Routes ---
// CREATE a new project
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// UPDATE a project
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProject)
            return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
// DELETE a project
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject)
            return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
