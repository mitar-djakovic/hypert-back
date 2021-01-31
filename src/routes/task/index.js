const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const List = require('../../models/list/listSchema');
const Task = require('../../models/task/taskSchema');

// Create list task
router.post('/task', async (req, res) => {
  const { name, listId } = req.body;

  const taskData = {
    ...req.body,
    taskId: uuid.v4(),
  };

  const list = await List.findOne({ listId });
  const task = await Task.findOne({ name });
  if (!task && list) {
    Task.create(taskData).then((response) => res.status(201).json({
      message: 'Task created successfuly.',
      task: {
        name: response.name,
        taskId: response.taskId,
        listId: response.listId,
      },
    })).catch(() => res.status(400).json({ message: 'Unable to create task.' }));
  }
  if (task) {
    return res.status(400).json({ message: 'Task with this name allready exist.' });
  }
  if (!list) {
    return res.status(404).json({ message: 'List does not exist' });
  }
});

// Get list tasks
router.post('/tasks', async (req, res) => {
  const { listId } = req.body;
  const tasks = await Task.find({ listId });

  const updatedTasks = tasks.map((task) => ({
    name: task.name,
    taskId: task.taskId,
  }));
  if (tasks) {
    return res.status(201).json({ message: 'Task found.', tasks: updatedTasks });
  }
});
// Delete Project List
// router.delete('/project-list', async (req, res) => {
//   console.log('req', req.body);
// });

module.exports = router;
