const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/task");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/todolist")
    .then(() => console.log(" MongoDB connected"))
    .catch(err => console.error(" MongoDB connection error:", err));

// Get tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new task
app.post("/api/tasks", async (req, res) => {
    try {
        const { text } = req.body;
        const newTask = new Task({ text });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
