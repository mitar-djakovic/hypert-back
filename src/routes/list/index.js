const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const Project = require('../../models/project/projectSchema');

// Create Project List
router.post('/list', async (req, res) => {
  const { name, projectId } = req.body;

  const project = await Project.findOne({ projectId });

  if (!project) {
    return res.status(404).json({ message: 'Project does not exist.' });
  }

  if (project) {
    const newList = {
      name,
      listId: uuid.v4(),
      tasks: [],
    };

    const newLists = project.lists;

    const nameCheck = newLists.find((list) => list.name === name)?.name;

    if (nameCheck === name) {
      return res.status(400).json({ message: 'List with this name allready exist.' });
    }
    newLists.push(newList);

    project.lists = newLists;
    project.save();

    return res.status(201).json({
      message: 'List created successfuly.',
      list: newList,
    });
  }
});

router.post('/delete-list', async (req, res) => {
  const { projectId, listId } = req.body;
  const project = await Project.findOne({ projectId });

  console.log('project', project);
  if (!project) {
    return res.status(404).json({ message: 'Project does not exist.' });
  }

  if (project) {
    const updatedList = project.lists.filter((list) => list.listId !== listId);

    project.lists = updatedList;
    project.save();
    return res.status(200).json({ message: 'List deleted', lists: updatedList });
  }
});

module.exports = router;
