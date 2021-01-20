const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
  },
  adminId: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model('project', ProjectSchema);
