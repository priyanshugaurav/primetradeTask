const Task = require('../models/Task');

exports.getTasks = async (req, res, next) => {
  try {
    const query = req.user.role === 'ADMIN' ? {} : { user: req.user.id };
    
    const tasks = await Task.find(query)
      .populate('user', 'email')
      .sort({ createdAt: -1 });
      
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      user: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
};