const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: '',
  taskId: '',
  listId: '',
});

module.exports = mongoose.model('task', TaskSchema);
