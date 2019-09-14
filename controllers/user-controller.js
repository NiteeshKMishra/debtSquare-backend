const { Users } = require('../models/user-model');

const userSignup = (req, res, next) => {
  var user = req.body;
  if (user.imageId === '' || !user.imageId) {
    user.imageId = null;
  }
  else {
    user.imageId = mongodb.ObjectID(user.imageId);
  }
  var newuser = new Users(user);
  newuser.save().then((result) => {
    res.status(201).send(result)
  }).catch((err) => {
    res.status(406).send();
  })
}

const verifyCredentials = (req, res, next) => {
  var email = req.body.email.toLowerCase();
  var contactNumber = req.body.number;
  Users.findOne({ $or: [{ email }, { contactNumber }] }).then((user) => {
    if (user) {
      res.status(409).send()
    }
    else {
      res.status(202).send()
    }
  }).catch((err) => {
    res.status(404).send();
  });
}

module.exports = { userSignup, verifyCredentials }