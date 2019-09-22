require('../config/config')

const request = require('supertest')
const bcrypt = require('bcrypt')

const { app } = require('../src/app')
const { Users } = require('../src/models/user-model')
const { userOneId, userTwoId, userOne, userTwo, setupDB } = require('./fixtures/database')


beforeEach(setupDB)

describe('User Signup Tests', () => {
  test('should successfully signup user', async () => {
    var user = {
      firstName: "Mike",
      lastName: "Williams",
      contactNumber: 6587458125,
      email: "mikewilliams@gmail.com",
      password: "abc123",
      dob: "03-03-1990",
      sex: "Male",
      city: "Delhi"
    }
    var response = await request(app)
      .post('/user/signup')
      .send(user)
      .expect(201)

    expect(response.body.user.password).toBeUndefined()

    var dbUser = await Users.findById(response.body.user._id)
    expect(dbUser).not.toBeNull()
  })

  test('should not signup user', async () => {
    await request(app)
      .post('/user/signup')
      .send(userOne)
      .expect(406)
  })
})


describe('User Signin Tests', () => {
  test('should successfully signin user', async () => {
    var response = await request(app)
      .post('/user/signin')
      .send({
        loginId: userOne.contactNumber,
        password: process.env.USER_PASSWORD
      })
      .expect(200)
    var dbUser = await Users.findById(userOneId)
    expect(response.body.token).toBe(dbUser.tokens[1].token)
    expect(response.header.authorization.split(' ')[1]).toBe(dbUser.tokens[1].token)
  })

  test('should not signin user', async () => {
    await request(app)
      .post('/user/signin')
      .send({
        loginId: userOne.contactNumber,
        password: 'wrongPassword'
      })
      .expect(404)
  })
})

describe('Verify User Tests', () => {
  test('should not accepct if user credentials are already used', async () => {
    await request(app)
      .post('/user/verifycredentials')
      .send({
        email: userOne.email,
        number: userOne.contactNumber
      })
      .expect(409)
  })

  test('should accepct if user credentials are not used', async () => {
    await request(app)
      .post('/user/verifycredentials')
      .send({
        email: 'hello.world@gmail.com',
        number: 8551313585
      })
      .expect(202)
  })
})

describe('Fecthing Signed in User Tests', () => {
  test('should fetch currently signed in user details', async () => {
    var response = await request(app)
      .get('/user/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    expect(response.body.user._id.str).toEqual(userOneId.str)
  })

  test('should not fetch user details', async () => {
    await request(app)
      .get('/user/me')
      .send()
      .expect(401)
  })
})

describe('Update User Tests', () => {
  test('should update user details', async () => {
    updates = {
      email: 'newemail@gmail.com',
      password: 'newPassword'
    }
    var response = await request(app)
      .patch('/user/updateprofile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(updates)
      .expect(200)

    expect(response.body.user.email).toBe(updates.email)

    var dbUser = await Users.findById(userOneId)
    var pass = await bcrypt.compare(updates.password, dbUser.password)
    expect(pass).toBeTruthy()
  })

  test('should not update user details', async () => {
    updates = {
      email: 'hjhjbjnb@jgbjbj',
      Name: 'newName9879'
    }
    await request(app)
      .patch('/user/updateprofile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(updates)
      .expect(400)

    var dbUser = await Users.findById(userOneId)
    expect(dbUser.email).not.toBe(updates.email)
  })

  test('should not update invalid user details', async () => {
    updates = {
      age: 25,
      Name: 'newName'
    }
    var response = await request(app)
      .patch('/user/updateprofile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(updates)
      .expect(400)

    expect(response.body.message).toBe('Updates is/are invalid')
  })
})

describe('User Sign Out Tests', () => {
  test('should signout currently logged in user', async () => {
    var response = request(app)
      .post('/user/logout')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)

    var dbUser = await Users.findById(userOneId)
    expect(dbUser.tokens.length).toBe(1)
  })

  test('should not signout user', async () => {
    request(app)
      .post('/user/logout')
      .send()
      .expect(401)
  })
})

describe('User Delete Tests', () => {
  test('should delete user from database', async () => {
    request(app)
      .delete('/user/delete')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
  })

  test('should not delete user from database', async () => {
    request(app)
      .delete('/user/delete')
      .send()
      .expect(401)
  })
})

describe('Uploading ProfilePic Tests', () => {
  test('should successfully upload profilepic of user', async () => {
    var response = await request(app)
      .post('/user/uploadpic')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .attach('ProfilePic', './tests/fixtures/mypic.jpg')
      .expect(200)

    var dbUser = await Users.findById(userTwoId)
    expect(response.body.file.id.str).toEqual(dbUser.imageId.str)
  })
  test('should not upload profilepic of user', async () => {
    await request(app)
      .post('/user/uploadpic')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .attach('LrofilePic', './tests/fixtures/mypic.jpg')
      .expect(500)
  })
})

describe('Get User ProfilePic Tests', () => {
  test('should successfully get profilepic of user', async () => {
    await request(app)
      .get('/user/profilepic')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .expect(200)
  })
  test('should not get profilepic of user', async () => {
    await request(app)
      .get('/user/profilepic')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(404)
    var dbUser = await Users.findById(userOneId)
    expect(dbUser.imageId).toBeNull()
  })
})

describe('Delete User ProfilePic Tests', () => {
  test('should successfully delete profilepic of user', async () => {
    await request(app)
      .delete('/user/deletepic')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .expect(200)
    var dbUser = await Users.findById(userTwoId)
    expect(dbUser.imageId).toBeNull()
  })
  test('should not delete profilepic of user', async () => {
    await request(app)
      .delete('/user/deletepic')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(404)
    var dbUser = await Users.findById(userOneId)
    expect(dbUser.imageId).toBeNull()
  })
})