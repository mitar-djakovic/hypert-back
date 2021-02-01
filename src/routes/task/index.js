const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const Project = require('../../models/project/projectSchema');

// Create list task
router.post('/task', async (req, res) => {
  const { name, listId, projectId } = req.body;

  const project = await Project.findOne({ projectId });
  if (!project) {
    return res.status(404).json({ message: 'Project does not exist.' });
  }

  if (project) {
    const newTask = {
      name,
      taskId: uuid.v4(),
    };
    const searchedList = project.lists.find((list) => list.listId === listId);
    const newTasks = searchedList.tasks;
    const taskCheck = newTasks.find((task) => task.name === name)?.name;

    if (taskCheck === name) {
      return res.status(400).json({ message: 'Task with this name allready exist.' });
    }
    newTasks.push(newTask);

    searchedList.tasks = newTasks;

    project.save();
    return res.status(201).json({ message: 'Task created successfuly.', task: newTask });
  }
});

module.exports = router;
