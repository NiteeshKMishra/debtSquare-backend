require('../../config/config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const { Users } = require('../../src/models/user-model')
const { Ledger } = require('../../src/models/ledger-model')

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  firstName: "Jack",
  lastName: "Daneial",
  contactNumber: 5425419843,
  email: "jack.daneial@gmail.com",
  password: process.env.USER_PASSWORD,
  dob: "05-02-1982",
  sex: "Male",
  city: "Banglore",
  tokens: [{ token: jwt.sign({ _id: userOneId.toHexString() }, process.env.JWT_SECRET) }]
}

const userTwo = {
  _id: userTwoId,
  firstName: "Sophie",
  lastName: "Wells",
  imageId: '5d87474e49aa472064ebe40c',
  contactNumber: 8945419843,
  email: "sophie.wells@gmail.com",
  password: process.env.USER_PASSWORD,
  dob: "08-11-1986",
  sex: "Female",
  city: "Mumbai",
  tokens: [{ token: jwt.sign({ _id: userTwoId.toHexString() }, process.env.JWT_SECRET) }]
}

const ledgerOne = {
  _id: new mongoose.Types.ObjectId(),
  ownerId: userTwoId,
  ledger: [{
    userId: userOneId,
    amount: -456,
    updatedAt: Date.now()
  }]
}
const setupDB = async () => {
  await Users.deleteMany()
  await Ledger.deleteMany()
  await new Users(userOne).save()
  await new Users(userTwo).save()
  await new Ledger(ledgerOne).save()
}

module.exports = {
  userOneId, userTwoId, userOne, userTwo, ledgerOne, setupDB
}