const mongo = require('../lib/mongo')

module.exports = async (request, response) => {
  const url = request.url
  const schoolId = url.split('/')[2]
  const action = url.split('/')[3]
  let query = false
  const db = await mongo()
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)

  if (!schoolId && !action) {
    query = {
      type: 'skole'
    }
  } else if (schoolId && !action) {
    query = {
      schoolId: schoolId,
      type: 'skole'
    }
  } else if (schoolId && action && ['students', 'teachers'].includes(action)) {
    const schools = await tjommi.find({
      schoolId: schoolId,
      type: 'skole'
    }).toArray()
    query = {
      schoolIds: schools[0].id,
      type: action === 'students' ? 'student' : 'teacher'
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
