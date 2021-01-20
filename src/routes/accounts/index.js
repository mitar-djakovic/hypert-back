const express = require('express');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

const router = express.Router();
const secret = config.get('secret');

const Account = require('../../models/accounts');

router.post('/signup', (req, res) => {
  const {
    email, firstName, lastName, password, repeatPassword,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const accountData = {
    accountId: uuid.v4(),
    email,
    firstName,
    lastName,
    password: hashedPassword,
  };

  Account.findOne({ email }).then((acc) => {
    if (acc) {
      return res.status(400).json({ error: true, message: 'Account with this email allready exist.' });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ error: true, message: 'Password do not match.' });
    }

    Account.create(accountData).then(() => res.status(201).send({
      message: 'Account created successfully.',
    })).catch(() => res.status(400).json({ error: 'Unable to create this account.' }));
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  Account.findOne({ email }).exec((err, account) => {
    if (err) return res.status(500).json({ error: true, message: 'Error 500' });
    if (!account) return res.status(404).json({ error: true, message: 'Account not found' });

    const passwordIsValid = bcrypt.compareSync(password, account.password);

    if (!passwordIsValid) return res.status(401).send({ token: null, message: 'Invalid Credentials' });

    const token = jwt.sign({ id: account.id }, secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    return res.status(200).send({ message: 'Account found', token, id: account.id });
  });
});

module.exports = router;
