const express = require('express');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

const router = express.Router();
const secret = config.get('secret');

const Account = require('../../models/account/accountSchema');

router.post('/signup', async (req, res) => {
  const {
    email, password, repeatPassword,
  } = req.body;

  const account = await Account.findOne({ email });
  if (account) {
    return res.status(400).json({ message: 'Account with this email allready exist.' });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const accountData = {
    ...req.body,
    accountId: uuid.v4(),
    password: bcrypt.hashSync(password, 10),
  };

  const newAccount = await Account.create(accountData);
  if (newAccount) {
    return res.status(201).json({ message: 'Account created successfully.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const account = await Account.findOne({ email });

  if (!account) {
    return res.status(404).json({ message: 'Email or password is incorrect,' });
  }
  if (account) {
    const passwordIsValid = bcrypt.compareSync(password, account.password);

    if (!passwordIsValid) {
      return res.status(401).send({ token: null, message: 'Invalid Credentials' });
    }
    const token = jwt.sign({ accountId: account.accountId }, secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    return res.status(200).json({
      message: 'Loged in successfully',
      token,
      accountId: account.accountId,
      lastActiveProject: account.lastActiveProject,
    });
  }
});

// Treba mi ruta za extend tokena
// Interceptor na axios i provera tokena
// Mongose pogledati kako da fetchujem samo odredje stvari

module.exports = router;
