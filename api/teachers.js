const mongo = require('../lib/mongo')
const withTokenAuth = require('../lib/token-auth')

const handleTeachers = async (request, response) => {
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  let query = false
  if (!username && !action) {
    query = {
      type: 'teacher'
    }
  } else if (username && !action) {
    query = {
      username: username,
      type: 'teacher'
    }
  }
  if (query) {
    const db = await mongo()
    const tjommi = db.collection(process.env.MONGODB_COLLECTION)
    const data = await tjommi.find(query).toArray()
    response.json(data)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleTeachers)
