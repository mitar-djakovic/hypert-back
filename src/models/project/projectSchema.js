const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: '',
  accountId: '',
  name: '',
  lists: [
    {
      name: '',
      listId: '',
      tasks: [
        {
          name: '',
          taskId: '',
        },
      ],
    },
  ],
});

module.exports = mongoose.model('project', ProjectSchema);
