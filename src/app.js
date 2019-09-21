require('../config/config')

const express = require('express');
const bodyParser = require('body-parser');
const addRequestId = require('express-request-id')();
const morganbody = require('morgan-body');

const userRoutes = require('./routes/user-route')
const ledgerRoutes = require('./routes/ledger-route')

const { cors, reqLogger, resLogger, genError, errorHandler } = require('./middleware/middlewares')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(addRequestId);
morganbody(app);
app.use(cors);
app.use(reqLogger);
app.use(resLogger);

app.use(userRoutes);
app.use(ledgerRoutes);

app.use(genError)
app.use(errorHandler)

module.exports = { app }