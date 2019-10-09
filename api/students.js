const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')
const repackStudent = require('../lib/repack-student')
const logger = require('../lib/logger')

const handleStudents = async (request, response) => {
  const { caller } = request.token
  const { name } = await request.query
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]

  if (name) {
    logger('info', ['api', 'students', 'search by name', 'caller', caller, 'start'])
    try {
      const teachers = await getData({ type: 'teacher', username: caller })
      const teacher = teachers[0]
      const query = {
        type: 'student',
        fullName: { $regex: name.replace('*', '.*'), $options: 'i' },
        groupIds: { $in: teacher.groupIds }
      }

      logger('info', ['api', 'students', 'search by name', name])
      const data = await getData(query)

      logger('info', ['api', 'students', 'search by name', 'data', data.length])
      response.json(data.map(student => repackStudent(student, teacher)))
    } catch (error) {
      logger('error', ['api', 'students', 'search by name', error.message])
      response.status(500)
      response.json(error)
    }
  } else if (username && !action) {
    logger('info', ['api', 'students', 'search by username', username, 'caller', caller, 'start'])
    try {
      const teachers = await getData({ type: 'teacher', username: caller })
      const teacher = teachers[0]
      const teachersGroups = new Set(teacher.groupIds)
      const query = {
        type: 'student',
        username: username
      }
      const data = await getData(query)
      const isMyStudent = student => {
        const studentsGroups = new Set(student.groupIds)
        const intersection = new Set([...teachersGroups].filter(groupId => studentsGroups.has(groupId)))
        return intersection.size > 0
      }
      const myStudents = data.filter(isMyStudent)
      response.json(myStudents.map(student => repackStudent(student, teacher)))
    } catch (error) {
      logger('error', ['api', 'students', 'search by username', error.message])
      response.status(500)
      response.json(error)
    }
  } else if (username && action && ['contactteachers'].includes(action)) {
    try {
      // TODO: Validate this covers everything to get contactteachers
      const studentQuery = {
        type: 'student',
        username: username
      }
      const students = await getData(studentQuery)
      const { kontaktlarergruppeIds, ordenIds, atferdIds } = students[0]
      const kontaktIds = [...kontaktlarergruppeIds, ...ordenIds, ...atferdIds]
      const teacherQuery = groupId => {
        return {
          type: 'teacher',
          groupIds: groupId
        }
      }
      const queries = kontaktIds.map(teacherQuery)
      const jobs = queries.map(query => getData(query))
      const results = await Promise.all(jobs)
      const allTeachers = results.reduce((accumulator, current) => {
        if (current.length > 0) {
          accumulator.push(...current)
        }
        return accumulator
      }, [])
      const teachers = allTeachers.reduce((accumulator, current) => {
        const ids = accumulator.map(item => item.id)
        if (!ids.includes(current.id)) {
          accumulator.push(current)
        }
        return accumulator
      }, [])
      response.json(teachers)
    } catch (error) {
      logger('error', ['api', 'students', 'student contactteachers', error.message])
      response.status(500)
      response.json(error)
    }
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleStudents)
