import mongoose from 'mongoose';
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    imageUrl: { type: String, required: true },
    liveUrl: { type: String, required: true },
    githubUrl: { type: String, required: true },
    technologies: [{ type: String }],
    category: {
        type: String,
        required: true,
        enum: ['frontend', 'backend', 'fullstack', 'mobile']
    },
}, { timestamps: true });
const Project = mongoose.model('Project', projectSchema);
export default Project;
