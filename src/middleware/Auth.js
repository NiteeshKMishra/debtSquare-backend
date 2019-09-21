require('../../config/config')
const { Users } = require('../models/user-model')
const jwt = require('jsonwebtoken')

const Auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await Users.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Error('User is not Authorized')
    }
    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ message: error.message })
  }
}

module.exports = { Auth }