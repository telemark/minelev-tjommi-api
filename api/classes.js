const mongo = require('../lib/mongo')

module.exports = async (request, response) => {
  const url = request.url
  const classId = url.split('/')[2]
  const action = url.split('/')[3]
  let query = false

  if (classId && action && ['students', 'teachers'].includes(action)) {
    query = {
      groupIds: classId,
      type: action === 'students' ? 'student' : 'teacher'
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
