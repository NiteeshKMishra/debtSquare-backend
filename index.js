require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const addRequestId = require('express-request-id')();

const userRoutes = require('./routes/user-route')
const { logMessages } = require('./utils/logger')
const { cors, reqLogger, resLogger, genError, errorHandler } = require('./middleware/middlewares')

const app = express();
const PORT = process.env.PORT;

app.use(addRequestId);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors);
app.use(reqLogger);
app.use(resLogger);

app.use(userRoutes);

app.use(genError)
app.use(errorHandler)

app.listen(PORT, () => {
  logMessages('pass', `Server started on port ${PORT}`);
})