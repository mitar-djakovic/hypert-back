const express = require('express');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

const router = express.Router();
const secret = config.get('secret');

const Account = require('../../models/accounts');

router.post('/signup', async (req, res) => {
  const {
    email, password, repeatPassword,
  } = req.body;

  const accountData = {
    ...req.body,
    password: bcrypt.hashSync(password, 10),
    accountId: uuid.v4(),
  };

  const account = await Account.findOne({ email });
  if (account) {
    return res.status(400).json({ error: true, message: 'Account with this email allready exist.' });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ error: true, message: 'Passwords do not match.' });
  }
  Account.create(accountData).then(() => res.status(201).send({
    message: 'Account created successfully.',
  })).catch(() => res.status(400).json({ error: 'Unable to create this account.' }));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const account = await Account.findOne({ email });
  if (!account) {
    return res.status(404).json({ error: true, message: 'Account not found' });
  }
  if (account) {
    const passwordIsValid = bcrypt.compareSync(password, account.password);

    if (!passwordIsValid) return res.status(401).send({ token: null, message: 'Invalid Credentials' });
    const token = jwt.sign({ accountId: account.accountId }, secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    return res.status(200).json({
      message: 'Account found',
      token,
      accountId: account.accountId,
      lastActive: account.lastActive,
    });
  }
});

module.exports = router;
