const { mongoose } = require('./mongoose')

const LedgerSchema = new mongoose.Schema({
  ledger: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: 'Users'
    },
    amount: {
      type: Number,
      default: 0
    }
  }]
})

const Ledger = mongoose.model('Ledger', LedgerSchema)

module.exports = { Ledger }