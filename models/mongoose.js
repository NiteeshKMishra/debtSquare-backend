require('../config/config');
const { logMessages } = require('../logging/logger')
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
  if (err) {
    logMessages('fail', 'Unable to connect to database');
  }
  logMessages('pass', 'Successfully connected to database');
});
module.exports = { mongoose }

