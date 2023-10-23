"use strict";

const express = require('express');
const app = express();

// listen for requests on localhost:3000
app.listen(3000);

app.get('/', (req, res) => {

res.sendFile('./views/home.html', { root: __dirname });

});