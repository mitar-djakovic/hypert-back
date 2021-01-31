const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  name: '',
  listId: '',
  accountId: '',
  projectId: '',
});

module.exports = mongoose.model('list', ListSchema);
