'use strict';

const express = require('express');
const app = express();
const prom = require('prom-client');
const settings = require('./config');

const poll = require('./poll');

poll();

app.get('/metrics', (req, res) => {
	res.end(prom.register.metrics());
});
app.listen(settings.port || 3000);