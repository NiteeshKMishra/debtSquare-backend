const gridFsStream = require('gridfs-stream');
const mongodb = require('mongodb');

const { mongoose } = require('../models/mongoose')

const conn = mongoose.connection
var gfs;
conn.once('open', () => {
  gfs = gridFsStream(conn.db, mongoose.mongo);
  gfs.collection('ProfilePics');
});

const uploadPic = (req, res, next) => {
  if (!req.file || req.file.length === 0) {
    res.status(406).send()
  }
  res.status(200).send(req.file);
}

const getProfilepic = (req, res, next) => {
  var _id = mongodb.ObjectID(req.params.id);
  gfs.files.findOne({ _id: _id })
    .then((file) => {
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res)
    })
    .catch((err) => {
      res.status(404).send()
    });
}

const deletePic = (req, res, next) => {
  var _id = mongodb.ObjectID(req.query.id);
  gfs.remove({ _id: _id, root: 'ProfilePics' })
    .then((info) => {
      res.status(200).send()
    })
    .catch((err) => {
      res.status(404).send()
    });
}

module.exports = { uploadPic, getProfilepic, deletePic }