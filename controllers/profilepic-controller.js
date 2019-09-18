const gridFsStream = require('gridfs-stream');

const { mongoose } = require('../models/mongoose')


const conn = mongoose.connection
var gfs;
conn.once('open', () => {
  gfs = gridFsStream(conn.db, mongoose.mongo);
  gfs.collection('ProfilePics');
});

const uploadPic = async (req, res) => {
  if (!req.file || req.file.length === 0) {
    return res.status(406).send({ message: "Unable to upload pic" })
  }
  try {
    req.user.imageId = req.file.id
    await req.user.save()
    res.send({ file: req.file, message: 'Profile pic added successfully' })
  } catch (error) {
    res.status(406).send({ message: error.message })
  }
}

const getProfilepic = async (req, res) => {
  try {
    const found = await gfs.exist({ _id: req.user.imageId, root: 'ProfilePics' })
    if (!found) {
      return res.status(404).send({ message: "No Profile pic found" })
    }
    const file = await gfs.files.findOne({ _id: req.user.imageId });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res)
  } catch (error) {
    res.status(404).send({ message: error.message })
  }
}

const deletePic = async (req, res) => {
  try {
    const found = await gfs.exist({ _id: req.user.imageId, root: 'ProfilePics' })
    if (!found) {
      return res.status(404).send({ message: "No files to delete" })
    }
    await gfs.remove({ _id: req.user.imageId, root: 'ProfilePics' })
    req.user.imageId = null
    await req.user.save()
    res.status(200).send({ message: "Successfully removed profile pic" })
  } catch (error) {
    res.status(404).send({ message: error.message })
  }
}

module.exports = { uploadPic, getProfilepic, deletePic }