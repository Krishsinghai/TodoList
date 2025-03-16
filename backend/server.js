const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const Todo = require('./models/todo'); // Import your model

const app = express();
app.use(express.json());
app.use(cors());

const mongodbURI = process.env.MONGODB_URI;

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB Atlas:", err);
});

// Create Task
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// Get All Tasks
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Update Task
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Delete Task
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
