// index.js
const express = require('express');
const connectDB = require('./db');
const caregivers = require('./routes/caregivers');
const visits = require('./routes/visits');
const members = require('./routes/members');
const auth = require('./routes/auth');
const misc = require('./routes/misc');

const app = express();

connectDB();
app.use(express.json());

app.use('/caregivers', caregivers);
app.use('/visits', visits);
app.use('/members', members);
app.use('/auth', auth);
app.use('/misc', misc);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
