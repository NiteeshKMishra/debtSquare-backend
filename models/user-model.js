require('../config/config')

const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const { mongoose } = require('./mongoose');

var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error('First Name is invalid')
      }
    }
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error('Last Name is invalid')
      }
    }
  },
  contactNumber: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is Invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  dob: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      default: null
    }
  }]
});

UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    const pass = await bcrypt.hash(user.password, 8)
    user.password = pass
    next()
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

UserSchema.methods.generateToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

UserSchema.statics.findByCredentials = async (loginId, password) => {
  var flag = typeof loginId === 'string' ? 'e' : 'n'
  if (flag === 'e') {
    var user = await Users.findOne({ email: loginId })
  } else {
    var user = await Users.findOne({ contactNumber: loginId })
  }
  if (!user) {
    throw new Error('User Not Found. Unable to Sign in')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('User Not Found. Unable to Sign in')
  }
  return user
}

var Users = mongoose.model('Users', UserSchema);

module.exports = { Users };
