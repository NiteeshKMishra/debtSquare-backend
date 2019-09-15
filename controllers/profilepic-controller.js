const gridFsStream = require('gridfs-stream');
const mongodb = require('mongodb');

const { mongoose } = require('../models/mongoose')

const conn = mongoose.connection
var gfs;
conn.once('open', () => {
  gfs = gridFsStream(conn.db, mongoose.mongo);
  gfs.collection('ProfilePics');
});

const uploadPic = async (req, res) => {
  if (!req.file || req.file.length === 0) {
    res.status(406).send()
  }
  res.status(200).send(req.file);
}

const getProfilepic = async (req, res) => {
  var _id = mongodb.ObjectID(req.params.id);
  try {
    const file = await gfs.files.findOne({ _id: _id });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res)
  } catch (error) {
    res.status(404).send()
  }
}

const deletePic = async (req, res) => {
  var _id = mongodb.ObjectID(req.query.id);
  try {
    await gfs.remove({ _id: _id, root: 'ProfilePics' })
    res.status(200).send()
  } catch (error) {
    res.status(404).send()
  }
}

module.exports = { uploadPic, getProfilepic, deletePic }