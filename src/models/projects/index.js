const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: '',
  accountId: '',
  name: '',
});

module.exports = mongoose.model('project', ProjectSchema);
