const mongo = require('../lib/mongo')
const withTokenAuth = require('../lib/token-auth')

const handleStudents = async (request, response) => {
  const { name } = await request.query
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  let query = false
  const db = await mongo()
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)

  if (name) {
    query = {
      type: 'student',
      fullName: { $regex: name, $options: 'i' }
    }
  } else if (username && !action) {
    query = {
      type: 'student',
      username: username
    }
  } else if (username && action && ['contactteachers'].includes(action)) {
    query = {
      type: 'student',
      username: username
    }
  }

  if (query) {
    const data = await tjommi.find(query).toArray()
    response.json(data)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleStudents)
