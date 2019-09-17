const mongo = require('../lib/mongo')

module.exports = async query => {
  const db = await mongo()
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)
  return tjommi.find(query).toArray()
}
