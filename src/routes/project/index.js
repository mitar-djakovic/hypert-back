const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const Project = require('../../models/project/projectSchema');
const Account = require('../../models/account/accountSchema');

// Create Projects
router.post('/project', async (req, res) => {
  const { name, accountId } = req.body;

  const project = await Project.findOne({ name });
  const account = await Account.findOne({ accountId });

  if (!account) {
    return res.status(404).json({ message: 'Account does not exist' });
  }

  if (account) {
    if (project) {
      return res.status(400).json({ message: 'Project with this name allready exist.' });
    }
    const projectData = {
      ...req.body,
      projectId: uuid.v4(),
    };
    const newProject = await Project.create(projectData);
    if (newProject) {
      return res.status(201).json({
        message: 'Project created succesfuly',
        project: { name: newProject.name, projectId: newProject.projectId },
      });
    }
  }
});

// Get Projects
router.post('/projects', async (req, res) => {
  const { accountId } = req.body;

  const account = await Account.findOne({ accountId });
  if (account) {
    const projects = await Project.find({ accountId });

    const filteredProjects = projects.map((project) => ({
      name: project.name,
      projectId: project.projectId,
    }));

    if (projects) {
      return res.status(201).json({ message: 'Projects found.', projects: filteredProjects });
    }
    if (!projects) {
      return res.status(404).json({ message: 'No projects are found.' });
    }
  }

  if (!account) {
    return res.status(404).json({ message: 'Account does not exist.' });
  }
});

router.post('/single-project', async (req, res) => {
  const { projectId } = req.body;

  const project = await Project.findOne({ projectId });

  if (project) {
    return res.status(201).json({ message: 'Project found.', project });
  }
  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }
});

// Delete Projects
router.delete('/project', async (req, res) => {
  const { projectId, accountId } = req.body;

  const account = await Account.findOne({ accountId });

  if (account) {
    const project = await Project.findOneAndDelete({ projectId });
    if (project) {
      return res.status(200).json({ message: 'Project deleted successfuly.' });
    }
    return res.status(404).json({ message: 'Project not found.' });
  }
  if (!account) {
    return res.status(404).json({ message: 'Account does not exist.' });
  }
});

// Set Last Active Project
router.patch('/last-project', async (req, res) => {
  const { accountId, projectId } = req.body;

  const project = await Project.findOne({ projectId });
  const account = await Account.findOne({ accountId });

  if (!account) {
    return res.status(404).json({ message: 'Account does not exist.' });
  }
  if (!project) {
    return res.status(404).json({ message: 'Project does not exist.' });
  }
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
});

module.exports = router;
