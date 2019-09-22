const express = require('express');
const router = new express.Router();

const { Auth } = require('../middleware/Auth')

const { addLedger, getLedger, updateLedger, deleteOneRecord, deleteLedger } = require('../controllers/ledger-controller')

router.post('/ledger/addledger', Auth, addLedger)

router.get('/ledger/getledger', Auth, getLedger)

router.patch('/ledger/updateledger', Auth, updateLedger)

router.delete('/ledger/deleteoneledger', Auth, deleteOneRecord)

router.delete('/ledger/deleteledger', Auth, deleteLedger)

module.exports = router