require('dotenv').config()
const express = require('express');
const app = express();
const db = require('./db');
const router = require('./routes');

const port = process.env.PORT;

app.use('/api/v1',router);

app.listen(port, ()=> {
    console.log(`App Listening on port ${port}`);
})