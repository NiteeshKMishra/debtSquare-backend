require('./config/config')
const { logMessages } = require('./src/utils/logger')

const { app } = require('./src/app')
const PORT = process.env.PORT;

app.listen(PORT, () => {
  logMessages('pass', `Server started on port ${PORT}`);
})