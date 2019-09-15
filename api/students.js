const mongo = require('../lib/mongo')
const withTokenAuth = require('../lib/token-auth')

const handleStudents = async (request, response) => {
  const { caller } = request.token
  const { name } = await request.query
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  const db = await mongo()
  const tjommi = db.collection(process.env.MONGODB_COLLECTION)

  if (name) {
    const teachers = await tjommi.find({ type: 'teacher', username: caller }).toArray()
    const teacher = teachers[0]
    const teachersGroups = new Set(teacher.groupIds)
    const query = {
      type: 'student',
      fullName: { $regex: name, $options: 'i' }
    }
    const data = await tjommi.find(query).toArray()
    const isMyStudent = student => {
      const studentsGroups = new Set(student.groupIds)
      const intersection = new Set([...teachersGroups].filter(groupId => studentsGroups.has(groupId)))
      return intersection.size > 0
    }
    response.json(data.filter(isMyStudent))
  } else if (username && !action) {
    const teachers = await tjommi.find({ type: 'teacher', username: caller }).toArray()
    const teacher = teachers[0]
    const teachersGroups = new Set(teacher.groupIds)
    const query = {
      type: 'student',
      username: username
    }
    const data = await tjommi.find(query).toArray()
    const isMyStudent = student => {
      const studentsGroups = new Set(student.groupIds)
      const intersection = new Set([...teachersGroups].filter(groupId => studentsGroups.has(groupId)))
      return intersection.size > 0
    }
    response.json(data.filter(isMyStudent))
  } else if (username && action && ['contactteachers'].includes(action)) {
    const studentQuery = {
      type: 'student',
      username: username
    }
    const students = await tjommi.find(studentQuery).toArray()
    const { kontaktlarergruppeIds } = students[0]
    const teacherQuery = {
      type: 'teacher',
      groupIds: kontaktlarergruppeIds[0]
    }
    const teachers = await tjommi.find(teacherQuery).toArray()
    response.json(teachers)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleStudents)
