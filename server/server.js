require('../config/config')
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { Users } = require('../models/users');


const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use((req, res, next) => {
  // Set CORS headers so that the Angular SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/user/signup', (req, res) => {
  var user = new Users(req.body);
  user.email = user.email.toLowerCase();
  user.save().then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(406).send(err);
  })
})

app.post('/user/verifyuser', (req, res) => {
  var email = req.body.email.toLowerCase();
  var contactNumber = req.body.number;
  Users.findOne({ $or: [{ email }, { contactNumber }] }).then((user) => {
    if (user) {
      if (user.email.toLowerCase() === email) {
        res.status(200).json({ message: 'Email is already in use. Please Enter another email' })
      }
      else {
        res.status(200).json({ message: 'Contact Number is already in use. Please Enter another Number' })
      }
    }
    else {
      res.status(200).json({ message: 'No records found' });
    }
  }).catch((err) => {
    if (err) {
      res.status(500);
    }
  });
})

app.post('user/login', (req, res) => {
  console.log()
})

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
})