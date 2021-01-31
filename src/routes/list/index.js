const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const { response } = require('express');
const Project = require('../../models/project/projectSchema');
const Account = require('../../models/account/accountSchema');
const List = require('../../models/list/listSchema');
const Task = require('../../models/task/taskSchema');

// Create Project List
router.post('/list', async (req, res) => {
  const { name, accountId, projectId } = req.body;

  const listData = {
    ...req.body,
    listId: uuid.v4(),
  };

  const account = await Account.findOne({ accountId });
  const project = await Project.findOne({ projectId });
  const list = await List.findOne({ name });

  if (account && project && !list) {
    List.create(listData).then((response) => res.status(201).json({
      message: 'List created successfuly.',
      list: {
        name: response.name,
        tasks: response.tasks,
        listId: response.listId,
      },
    })).catch(() => res.status(400).json({ message: 'Unable to create list.' }));
  }

  if (!account) {
    return res.status(404).json({ message: 'Account does not exist.' });
  }
  if (!project) {
    return res.status(404).json({ message: 'Project does not exist.' });
  }
  if (list) {
    return res.status(400).json({ message: 'List with this name allready exist.' });
  }
});

// Get Project Lists
router.post('/lists', async (req, res) => {
  const { accountId, projectId } = req.body;

  const account = await Account.findOne({ accountId });
  const lists = await List.find({ projectId });

  const newLists = lists.map((list) => ({
    name: list.name,
    listId: list.listId,
  }));

  if (account) {
    return res.status(201).json({ lists: newLists });
  }
  if (!account) {
    return res.status(404).json({ message: 'Account does not exist.' });
  }
});

module.exports = router;
