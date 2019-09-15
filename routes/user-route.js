const express = require('express');
const router = new express.Router();

const { upload } = require('../utils/image-storage')
const { userSignup, verifyCredentials, userSignin } = require('../controllers/user-controller')
const { uploadPic, getProfilepic, deletePic } = require('../controllers/profilepic-controller')

router.post('/user/signup', userSignup)

router.post('/user/signin', userSignin)

router.post('/user/verifycredentials', verifyCredentials)

router.post('/user/uploadpic', upload.single('ProfilePic'), uploadPic)

router.get('/user/profilepic/:id', getProfilepic)

router.delete('/user/deletepic', deletePic)

module.exports = router;