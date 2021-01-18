const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  repeatPassword: {
    type: String,
  },
});

module.exports = mongoose.model('account', AccountSchema);
