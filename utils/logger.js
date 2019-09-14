const bunyan = require('bunyan')
const path = require('path')

const logger = bunyan.createLogger({
  name: 'DebtSquare Logger',
  level: 'info',
  streams: [{
    path: path.resolve(__dirname, '..', 'logs.json')
  }],
  serializers: {
    req: require('bunyan-express-serializer'),
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  }
});

const logMessages = (status, msg) => {
  var log = logger.child({
    status: status,
    time: new Date().toString()
  })
  if (status === 'pass') {
    log.info(msg)
  } else {
    log.error(msg)
  }
}

module.exports = { logger, logMessages }