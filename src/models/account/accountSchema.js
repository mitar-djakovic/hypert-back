const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountId: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  lastActiveProject: {
    projectId: '',
    name: '',
  },
});

module.exports = mongoose.model('account', AccountSchema);
