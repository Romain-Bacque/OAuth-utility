require('dotenv').config();

const express = require('express');
const app = express();

// If process.env.PORT is falsy, then we use port 3000 as fallback
const port = process.env.PORT || 3000;

app.use(require('./app/index'));

// Listening port
app.listen(port, () => {
    console.log(`Connected to port ${port}`);
});