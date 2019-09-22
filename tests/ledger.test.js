const request = require('supertest')
const mongoose = require('mongoose')

const { app } = require('../src/app')
const { Ledger } = require('../src/models/ledger-model')
const { userOneId, userOne, userTwo, userTwoId, ledgerOne, setupDB } = require('./fixtures/database')

beforeEach(setupDB)

describe('Adding Ledger Tests', () => {
  test('should add ledger for user', async () => {
    await request(app)
      .post('/ledger/addledger')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)

    var dbLedger = await Ledger.findOne({ ownerId: userOneId })
    expect(dbLedger).not.toBeNull()
  })
  test('should not add ledger for user', async () => {
    await request(app)
      .post('/ledger/addledger')
      .send()
      .expect(401)
  })
})

describe('Get Ledger Tests', () => {
  test('should retrieve Ledger for User', async () => {
    var response = await request(app)
      .get('/ledger/getledger')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(200)
    expect(response.body.Ledger.ownerId.str).toEqual(userTwoId.str)
    expect(response.body.Ledger.ledger[0].userId._id.str).toEqual(userOneId.str)
  })
  test('should not retrieve ledger for user', async () => {
    await request(app)
      .get('/ledger/getledger')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(400)
  })
})

describe('Update Ledger Tests', () => {
  test('should not update user Ledger', async () => {
    var updates = {
      userId: userOneId,
      carryOver: 25
    }
    var response = await request(app)
      .patch('/ledger/updateledger')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send(updates)
      .expect(400)

    expect(response.body.message).toBe('Updates is/are invalid')
  })

  test('should add new users Ledger', async () => {
    var updates = {
      userId: new mongoose.Types.ObjectId(),
      amount: 68
    }
    var response = await request(app)
      .patch('/ledger/updateledger')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send(updates)
      .expect(200)

    expect(response.body.ledger.ledger.length).toBe(2)

    var dbLedger = await Ledger.findOne({ ownerId: userTwoId })
    expect(dbLedger.ledger[1]).toMatchObject(updates)
  })

  test('should update existing user amount', async () => {
    var updates = {
      userId: userOneId,
      amount: 457
    }
    var response = await request(app)
      .patch('/ledger/updateledger')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send(updates)
      .expect(200)

    expect(response.body.ledger.ledger.length).toBe(1)

    var dbLedger = await Ledger.findOne({ ownerId: userTwoId })
    expect(dbLedger.ledger[0].amount).toBe(1)
  })
})

describe('Deleting Ledger Tests', () => {
  test('should delete ledger for user', async () => {
    await request(app)
      .delete('/ledger/deleteledger')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(200)

    var dbLedger = await Ledger.findOne({ ownerId: userOneId })
    expect(dbLedger).toBeNull()
  })
  test('should not delete ledger for user', async () => {
    await request(app)
      .delete('/ledger/deleteledger')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(404)
  })
})

describe('Delete One Ledger Record Tests', () => {
  test('should delete one ledger record for user', async () => {
    await request(app)
      .delete('/ledger/deleteoneledger')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send({ id: userOneId })
      .expect(200)

    var dbLedger = await Ledger.findOne({ ownerId: userTwoId })
    expect(dbLedger.ledger.length).toBe(0)
  })
  test('should not delete any ledger record for user', async () => {
    await request(app)
      .delete('/ledger/deleteoneledger')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(400)
  })
})