const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')
const repackStudent = require('../lib/repack-student')
const logger = require('../lib/logger')
const uuid = require('uuid/v4')

const handleTeachers = async (request, response) => {
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  const id = uuid()

  if (!username && !action) {
    const query = {
      type: 'teacher'
    }
    try {
      const data = await getData(query)
      response.json(data)
    } catch (error) {
      logger('info', [id, 'api', 'teachers', username, 'error', error.message])
      response.status(500)
      response.status(error.message)
    }
  } else if (username && !action) {
    const query = {
      username: username,
      type: 'teacher'
    }
    try {
      const data = await getData(query)
      response.json(data)
    } catch (error) {
      logger('info', [id, 'api', 'teachers', username, 'error', error.message])
      response.status(500)
      response.status(error.message)
    }
  } else if (username && action && ['contactclasses'].includes(action)) {
    const teacherQuery = {
      username: username,
      type: 'teacher'
    }
    try {
      const teachers = await getData(teacherQuery)
      const teacher = teachers[0]
      const groupQuery = {
        memberIds: teacher.id
      }
      // TODO: Implement a way to filter out contactclasses
      const groups = await getData(groupQuery)
      response.json(groups)
    } catch (error) {
      logger('info', [id, 'api', 'teachers', username, 'error', error.message])
      response.status(500)
      response.status(error.message)
    }
  } else if (username && action && ['students'].includes(action)) {
    const teacherQuery = {
      username: username,
      type: 'teacher'
    }
    try {
      const teachers = await getData(teacherQuery)
      const teacher = teachers[0]
      const studentQuery = {
        type: 'student',
        groupIds: { $in: teacher.groupIds }
      }
      // TODO: Implement a way to filter out contactclasses
      const students = await getData(studentQuery)
      response.json(students.map(repackStudent))
    } catch (error) {
      logger('info', [id, 'api', 'teachers', username, 'error', error.message])
      response.status(500)
      response.status(error.message)
    }
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleTeachers)
