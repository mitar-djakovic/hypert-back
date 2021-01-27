const mongoose = require('mongoose');

const ProjectListSchema = new mongoose.Schema({
  projectListId: '',
  accountId: '',
  name: '',
});

module.exports = mongoose.model('project-list', ProjectListSchema);
