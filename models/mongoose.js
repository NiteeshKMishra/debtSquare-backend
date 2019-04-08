require('../config/config');

const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('Unable to connect to database');
  }
  console.log('Successfully connected to database');
});

module.exports = { mongoose }

