const mongo = require('../lib/mongo')
const withTokenAuth = require('../lib/token-auth')

const handleTeachers = async (request, response) => {
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  const db = await mongo()
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)

  if (!username && !action) {
    const query = {
      type: 'teacher'
    }
    const data = await tjommi.find(query).toArray()
    response.json(data)
  } else if (username && !action) {
    const query = {
      username: username,
      type: 'teacher'
    }
    const data = await tjommi.find(query).toArray()
    response.json(data)
  } else if (username && action && ['contactclasses'].includes(action)) {
    const teacherQuery = {
      username: username,
      type: 'teacher'
    }
    const teachers = await tjommi.find(teacherQuery).toArray()
    const teacher = teachers[0]
    const groupQuery = {
      memberIds: teacher.id
    }
    // TODO: Implement a way to filter out contactclasses
    const groups = await tjommi.find(groupQuery).toArray()
    response.json(groups)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleTeachers)
