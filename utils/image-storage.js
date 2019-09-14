require('../config/config');

const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');


//create storage for gridfs
var storage = new gridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'ProfilePics'
        };
        resolve(fileInfo)
      })
    });
  }
})

const upload = multer({ storage });

module.exports = { upload }