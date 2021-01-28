const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const account = require('./routes/account');
const project = require('./routes/project');
const list = require('./routes/list');
const connectDB = require('../config/db');

const app = express();

connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', account);
app.use('/api/dashboard', project);
app.use('/api/dashboard', list);

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
