const { Ledger } = require('../models/ledger-model')

const addLedger = async (req, res) => {
  var userLedger = {
    ...req.body,
    ledger: []
  }
  try {
    const ledger = await new Ledger(userLedger).save()
    res.send({ userLedger: ledger, message: 'Successfully Added Ledger for User' })
  } catch (error) {
    res.status(409).send({ message: error.message })
  }
}

const getLedger = async (req, res) => {
  try {
    const userLedger = await Ledger.findById(req.user._id)
    if (!userLedger) {
      return res.status(404).send({ message: 'No ledger record found' })
    }
    res.send({ Ledger: userLedger.ledger, message: 'User Ledger retrieved Successfully' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const updateLedger = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowUpdates = ['_id', 'amount']
  const isValidUpdate = updates.every((update) => allowUpdates.includes(update))
  if (!isValidUpdate) {
    return res.status(400).send({ message: 'Updates is/are invalid' })
  }
  try {
    const ledger = await Ledger.findById(req.user._id)
    var isNew = true
    for (var index = 0; index < ledger.ledger.length; index++) {
      if (ledger.ledger[index]._id == req.body._id) {
        isNew = false
        break
      }
    }
    if (isNew) {
      ledger.ledger = ledger.ledger.concat(req.body)
      await ledger.save()
      res.send({ ledger, message: 'Updated user ledger with new user ledger' })
    }
    else {
      ledger.ledger[index].amount = ledger.ledger[index].amount + req.body.amount
      await ledger.save()
      res.send({ ledger, message: 'Updated user ledger amount' })
    }
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

const deleteLedger = async (req, res) => {
  try {
    const deletedLedger = await Ledger.findByIdAndDelete(req.user._id)
    if (!deletedLedger) {
      return res.status(404).send({ message: 'No ledger to delete' })
    }
    res.send({ ledger: deletedLedger, message: 'Successfully Deleted Ledger of User' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

module.exports = { addLedger, getLedger, updateLedger, deleteLedger }