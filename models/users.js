const validator = require('validator');
const { mongoose } = require('./mongoose');

var UserSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    validate: {
      validator: validator.isAlpha,
      message: '{Value} should not contan any Numbers or Special Characters'
    }
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: validator.isAlpha,
      message: '{Value} should not contan any Numbers or Special Characters'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  securityQuestion: {
    type: String,
    required: true
  },
  securityAnswer: {
    type: String,
    required: true
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  dob: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{Value} is not a valid email'
    }
  },
  contactNumber: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10
  },
  sex: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  credits: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    amount: {
      type: Number,
      default: 0
    }
  }],
  debts: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    amount: {
      type: Number,
      default: 0
    }
  }]

});

var Users = mongoose.model('Users', UserSchema);

module.exports = { Users };
