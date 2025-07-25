const db = require("../model");
const Task = db.task;

// Get all tasks for the authenticated user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({createdBy: req.user});
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(tasks.map((task) => task.toJSON()));
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, createdBy: req.user });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task.toJSON());
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ message: "Error retrieving task", error });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Update a task
const updateTask = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const {title,description, dueDate, priority, status } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user,
      },
      {
        title,
        description,
        dueDate,
        priority,
        status,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      createdBy: req.user,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
