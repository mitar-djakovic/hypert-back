const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const Project = require('../../models/projects');

router.post('/project', (req, res) => {
  const { adminId, name } = req.body;

  const projectData = {
    adminId,
    name,
    projectId: uuid.v4(),
  };

  Project.findOne({ name }).then((project) => {
    if (project) {
      return res.status(400).json({ error: true, message: 'Project with this name allready exist.' });
    }
    Project.create(projectData).then(() => res.status(201).send({
      message: 'Project created succesfuly',
    })).catch(() => res.status(400).json({ error: true, message: 'Unable to create project.' }));
  });
});

router.get('/project', (req, res) => {
  const { adminId } = req.body;

  Project.find({ adminId }).then((projects) => {
    if (projects) {
      return res.status(201).send({ message: 'Projects found.', projects });
    }
    return res.status(404).send({ error: true, message: 'No projects are found.' });
  });
});

router.delete('/project', (req, res) => {
  const { projectId } = req.body;

  Project.findOne({ projectId }).then((project) => {
    if (project) {
      Project.deleteOne({ projectId })
        .then(() => res.status(200).send({ message: 'Project deleted successfuly' }))
        .catch(() => res.status(400).json({ error: true, message: 'Unable to delete project' }));
    } else {
      return res.status(400).json({ error: true, message: 'Project with this id does not exist.' });
    }
  });
});

module.exports = router;
