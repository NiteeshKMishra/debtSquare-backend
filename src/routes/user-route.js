const express = require('express');
const router = new express.Router();

const { upload } = require('../utils/image-storage')
const { Auth } = require('../middleware/Auth')
const { userSignup, verifyCredentials, userSignin, userProfile, userUpdate, logout, userDelete } = require('../controllers/user-controller')
const { uploadPic, getProfilepic, deletePic } = require('../controllers/profilepic-controller')

router.post('/user/verifycredentials', verifyCredentials)

router.post('/user/signup', userSignup)

router.post('/user/signin', userSignin)

router.get('/user/me', Auth, userProfile)

router.patch('/user/updateprofile', Auth, userUpdate)

router.post('/user/logout', Auth, logout)

router.delete('/user/delete', Auth, userDelete)

router.post('/user/uploadpic', Auth, upload.single('ProfilePic'), uploadPic)

router.get('/user/profilepic', Auth, getProfilepic)

router.delete('/user/deletepic', Auth, deletePic)


module.exports = router;