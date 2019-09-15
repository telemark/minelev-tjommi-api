const MongoClient = require('mongodb').MongoClient
const logger = require('./logger')

let client = null

module.exports = function getMongoDb (fn) {
  if (!process.env.MONGODB_CONNECTION) {
    logger('error', ['mongo', 'missing MONGODB_CONNECTION'])
    throw new Error('Missing env MONGODB_CONNECTION')
  }
  if (client && !client.isConnected) {
    client = null
    logger('info', ['mongo', 'discard client'])
  }
  if (client === null) {
    client = new MongoClient(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    logger('info', ['mongo', 'new client init'])
  } else if (client.isConnected) {
    logger('info', ['mongo', 'client connected', 'quick return'])
    return client.db(process.env.MONGODB_NAME)
  }

  return new Promise((resolve, reject) => {
    client.connect(error => {
      if (error) {
        client = null
        logger('error', ['mongo', 'client error', error])
        return reject(error)
      } else {
        logger('info', ['mongo', 'new client connected'])
        resolve(client.db(process.env.MONGODB_NAME))
      }
    })
  })
}
