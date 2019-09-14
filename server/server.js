require('../config/config')
const path = require('path');
const { mongoose } = require('../models/mongoose');
const { upload, conn } = require('../utils/image-storage')


const { logResponse, logger, logMessages } = require('../logging/logger')

const addRequestId = require('express-request-id')();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const gridFsStream = require('gridfs-stream');


const { Users } = require('../models/users');


const app = express();
const PORT = process.env.PORT;

let gfs;
conn.once('open', () => {
  gfs = gridFsStream(conn.db, mongoose.mongo);
  gfs.collection('ProfilePics');
});

app.use(addRequestId);
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

app.use((req, res, next) => {
  var log = logger.child({
    id: req.id,
    body: req.body,
    url: req.url,
    method: req.method
  }, true)
  log.info(`${req.method} request to Endpoint ${req.url}`)
  next();
});

app.use(function (req, res, next) {
  function afterResponse() {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
  }
  res.on('finish', afterResponse);
  res.on('close', afterResponse);
  next();
});


app.post('/user/signup', (req, res) => {
  var user = req.body;
  if (user.imageId === '') {
    user.imageId = null;
  }
  else {
    user.imageId = mongodb.ObjectID(user.imageId);
  }
  user.email = user.email.toLowerCase();
  var newuser = new Users(user);
  newuser.save().then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(406).send(err);
  })
})


app.post('/user/uploadpic', upload.single('profilePic'), (req, res) => {
  if (!req.file || req.file.length === 0) {
    res.status(406).json({ err: "Something went wrong" })
  }
  res.status(200).send(req.file);
});

app.get('/user/profilepic/:id', (req, res) => {
  var _id = mongodb.ObjectID(req.params.id);
  gfs.files.findOne({ _id: _id })
    .then((file) => {
      if (!file || file.length === 0) {
        res.status(404).json({ err: 'No files found' })
      }
      else {
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res)
      }
    })
    .catch((err) => {
      res.status(404).json({ err: 'Something went wrong' })
    });
});

app.delete('/user/deletepic', (req, res) => {
  var _id = mongodb.ObjectID(req.query.id);
  gfs.remove({ _id: _id, root: 'ProfilePics' })
    .then((file) => {
      if (!file || file.length === 0) {
        res.status(404).json({ err: 'No files found' })
      }
      else {
        res.status(200).json({ message: 'File Deleted' })
      }
    })
    .catch((err) => {
      res.status(404).json({ err: 'Something went wrong' })
    })
});

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

app.post('/user/login', (req, res) => {
  var response = {
    fullname: `${req.body.firstname} ${req.body.lastname}`
  }
  logResponse(req.id, response, 200, 'Response is Successfull');
  res.status(200).send(response);
})

app.listen(PORT, () => {
  logMessages('pass', 'Server started on port ' + PORT);
})