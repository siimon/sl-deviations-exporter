'use strict';

const express = require('express');
const app = express();
const prom = require('prom-client');
const settings = require('./config');

const poll = require('./poll');

poll();

app.get('/metrics', (req, res) => {
	res.header('Content-Type', 'text/plain; charset=utf-8');
	res.end(prom.register.metrics());
});
app.listen(settings.port || 3000);

process.on('SIGTERM', () => {
	process.exit();
});

process.on('SIGINT', () => {
	process.exit();
});
