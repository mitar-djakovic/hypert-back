const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: '',
  taskId: '',
});

module.exports = mongoose.model('task', TaskSchema);
