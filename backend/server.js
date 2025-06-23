import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskSchema from './models/Task.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-todo', )
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});


app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await taskSchema.find({});
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }

    try {
        const newTask = new taskSchema({ text: text.trim() });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }

    try {
        const updatedTask = await taskSchema.findByIdAndUpdate(
            id,
            { text: text.trim(), completed },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await taskSchema.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});