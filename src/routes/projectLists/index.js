const express = require('express');
const uuid = require('uuid');

const router = express.Router();

// const Project = require('../../models/projects');
// const Account = require('../../models/accounts');
const ProjectList = require('../../models/projectList');

// Create Project List
router.post('/project-list', async (req, res) => {
  const { name, accountId } = req.body;

  const listData = {
    name,
    accountId,
    projectListId: uuid.v4(),
  };

  const projectList = await ProjectList.findOne({ name });

  if (projectList) {
    return res.status(400).json({ error: true, message: 'List with this name allready exist.' });
  }
  ProjectList.create(listData).then((response) => res.status(201).json({
    message: 'Project list created',
    projectList: {
      accountId: response.accountId,
      name: response.name,
      projectListId: response.projectListId,
    },
  })).catch(() => res.status(400).json({ error: true, message: 'Unable to create project list.' }));
});

// Get Project Lists
router.post('/project-lists', async (req, res) => {
  const { accountId } = req.body;

  const accountLists = await ProjectList.find({ accountId });

  const updatedLists = accountLists.map((list) => ({
    name: list.name,
    projectListId: list.projectListId,
  }));

  if (updatedLists) {
    return res.status(201).json({ message: 'Project list returned', projectLists: updatedLists });
  }
  return res.status(404).json({ error: true, message: 'No projects lists are found.' });
});

// Delete Project List
// router.delete('/project-list', async (req, res) => {
//   console.log('req', req.body);
// });

module.exports = router;
