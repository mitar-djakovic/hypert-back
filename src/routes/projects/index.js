const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const Project = require('../../models/projects');
const Account = require('../../models/accounts');

// Create Projects
router.post('/project', async (req, res) => {
  const { name } = req.body;

  const projectData = {
    ...req.body,
    projectId: uuid.v4(),
  };
  const project = await Project.findOne({ name });

  if (project) {
    return res.status(400).json({ error: true, message: 'Project with this name allready exist.' });
  }

  Project.create(projectData).then((response) => res.status(201).send({
    message: 'Project created succesfuly',
    project: {
      accountId: response.accountId,
      projectId: response.projectId,
      name: response.name,
    },
  })).catch(() => res.status(400).json({ error: true, message: 'Unable to create project.' }));
});

// Get Projects
router.post('/projects', async (req, res) => {
  const { accountId } = req.body;

  const projects = await Project.find({ accountId });
  const filteredProjects = projects.map((project) => ({
    accountId: project.accountId,
    projectId: project.projectId,
    name: project.name,
  }));

  if (projects) {
    return res.status(201).json({ message: 'Projects found.', projects: filteredProjects });
  }
  return res.status(404).json({ error: true, message: 'No projects are found.' });
});

// Delete Projects
router.delete('/project', async (req, res) => {
  const { projectId } = req.body;

  Project.findOne({ projectId }).then((project) => {
    if (project) {
      Project.deleteOne({ projectId })
        .then(() => res.status(200).json({ message: 'Project deleted successfuly' }))
        .catch(() => res.status(400).json({ error: true, message: 'Unable to delete project' }));
    } else {
      return res.status(400).json({ error: true, message: 'Project with this id does not exist.' });
    }
  });
});

// Set Last Active Project
router.patch('/set-last-project', async (req, res) => {
  const { accountId, projectId } = req.body;

  const project = await Project.findOne({ projectId });
  const account = await Account.findOne({ accountId });

  if (account.accountId === project.accountId) {
    account.lastActiveProject = project;
    account.save();

    return res.status(201).json({
      message: 'Last project added',
      lastActiveProject: {
        name: project.name,
        projectId: project.projectId,
      },
    });
  }
  return res.status(404).json({ message: 'Something is not right' });
});

module.exports = router;
