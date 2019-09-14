const { logger, logMessages } = require('../utils/logger')

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const reqLogger = (req, res, next) => {
  var log = logger.child({
    id: req.id,
    body: req.body,
    url: req.url,
    method: req.method
  }, true)
  log.info(`${req.method} request to Endpoint ${req.url}`)
  next();
}

const resLogger = (req, res, next) => {
  function afterResponse() {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
    var log = logger.child({
      id: req.id,
      status: res.statusCode,
      method: req.method
    }, true)
    if (res.statusCode < 400) {
      log.info(`Response from Endpoint url ${req.url} is successfull`)
    }
    else {
      log.error(`Request sent is/has ${res.statusMessage}`)
    }
  }
  res.on('finish', afterResponse);
  res.on('close', afterResponse);
  next();
}

const genError = (req, res, next) => {
  const error = new Error('No Routes Found')
  error.status = 404
  next(error)
}

const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500)
  logMessages('fail', error.message)
  res.json({
    error: error.message
  })
}

module.exports = { cors, reqLogger, resLogger, genError, errorHandler }