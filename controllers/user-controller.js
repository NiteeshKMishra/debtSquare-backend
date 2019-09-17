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
    res.setHeader('Authorization', `Bearer ${token}`)
    res.status(200).send({ user, token })
  } catch (error) {
    res.status(404).send(error.message)
  }
}

const userProfile = async (req, res) => {
  res.status(200).send(req.user)
}

const userUpdate = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowUpdates = ["imageId", "password", "firstName", "lastName", "contactNumber", "email", "dob", "sex", "city"]
  const isValidUpdate = updates.every((update) => allowUpdates.includes(update))
  if (!isValidUpdate) {
    return res.status(400).send()
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error.message)
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

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
}

const userDelete = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.user._id)
    res.send(user)
  } catch (error) {
    res.status(500).send()
  }
}

module.exports = { userSignup, verifyCredentials, userSignin, userProfile, userUpdate, logout, userDelete }