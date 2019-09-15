const { Users } = require('../models/user-model');

const userSignup = async (req, res) => {
  var user = req.body;
  if (user.imageId === '' || !user.imageId) {
    user.imageId = null;
  }
  else {
    user.imageId = mongodb.ObjectID(user.imageId);
  }
  try {
    var newuser = new Users(user)
    const result = await newuser.save()
    res.status(201).send(result)
  } catch (error) {
    res.status(406).send(error.message);
  }
}

const userSignin = async (req, res) => {
  try {
    const user = await Users.findByCredentials(req.body.loginId, req.body.password)
    const token = await user.generateToken()
    res.status(200).send({ user, token })
  } catch (error) {
    res.status(404).send(error.message)
  }
}

const verifyCredentials = async (req, res) => {
  var email = req.body.email.toLowerCase();
  var contactNumber = req.body.number;
  try {
    const user = await Users.findOne({ $or: [{ email }, { contactNumber }] })
    if (user) {
      res.status(409).send()
    }
    else {
      res.status(202).send()
    }
  } catch (error) {
    res.status(404).send(error);
  }
}

module.exports = { userSignup, verifyCredentials, userSignin }