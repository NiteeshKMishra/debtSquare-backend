const validator = require('validator');
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
    unique: true,
    minlength: 10,
    maxlength: 10
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
  }
});

var Users = mongoose.model('Users', UserSchema);

module.exports = { Users };
