const { mongoose } = require('./mongoose')

const LedgerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'Users'
  },
  ledger: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: 'Users'
    },
    amount: {
      type: Number,
      default: 0
    },
    updatedAt: {
      type: Number
    }
  }]
})

const Ledger = mongoose.model('Ledger', LedgerSchema)

module.exports = { Ledger }