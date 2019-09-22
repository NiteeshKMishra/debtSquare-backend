const { Users } = require('../models/user-model');
const { sendWelcomeEmail } = require('../utils/send-mail')

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
    await sendWelcomeEmail(result)
    res.status(201).send({ user: result, message: 'Successfully signed up user' })
  } catch (error) {
    res.status(406).send({ message: error.message });
  }
}

const userSignin = async (req, res) => {
  try {
    const user = await Users.findByCredentials(req.body.loginId, req.body.password)
    const token = await user.generateToken()
    res.setHeader('Authorization', `Bearer ${token}`)
    res.send({ user, token, message: 'Successfully signed in' })
  } catch (error) {
    res.status(404).send({ message: error.message })
  }
}

const userProfile = async (req, res) => {
  res.send({ user: req.user, message: 'User profile retrieved successfully' })
}

const userUpdate = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowUpdates = ['imageId', 'password', 'firstName', 'lastName', 'contactNumber', 'email', 'dob', 'sex', 'city']
  const isValidUpdate = updates.every((update) => allowUpdates.includes(update))
  if (!isValidUpdate) {
    return res.status(400).send({ message: 'Updates is/are invalid' })
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send({ user: req.user, message: 'User updated successfully' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const verifyCredentials = async (req, res) => {
  var email = req.body.email.toLowerCase();
  var contactNumber = req.body.number;
  try {
    const user = await Users.findOne({ $or: [{ email }, { contactNumber }] })
    if (!user) {
      return res.status(202).send({ message: 'Email Id and/or Contact Number can be used' })
    }
    res.status(409).send({ message: 'Email Id and/or Contact Number is already present in database' })
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    })
    await req.user.save()
    res.send({ message: 'Logged Out Successfully' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const userDelete = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.user._id)
    res.send({ user, message: 'Successfully deleted user' })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

module.exports = { userSignup, verifyCredentials, userSignin, userProfile, userUpdate, logout, userDelete }