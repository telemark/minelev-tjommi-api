const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')
const repackStudent = require('../lib/repack-student')
const logger = require('../lib/logger')
const uuid = require('uuid/v4')

const handleStudents = async (request, response) => {
  const { caller } = request.token
  const { name } = await request.query
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  const id = uuid()

  if (name) {
    logger('info', [id, 'api', 'students', 'search by name', 'caller', caller, 'search by name', name])

    try {
      // If caller is an email/UPN, check mail field instead of username
      const teacherQuery = { type: 'teacher' }
      if (caller.includes('@')) {
        teacherQuery.email = caller
      } else {
        teacherQuery.username = caller
      }

      console.log(teacherQuery)

      const teachers = await getData(teacherQuery)
      const teacher = teachers[0]

      if (!teacher || !teacher.groupIds || teacher.groupIds.length === 0) {
        logger('warn', [id, 'api', 'students', 'caller', caller, 'search by name', 'teacher has no groups'])

        response.json([])
        return
      }

      const query = {
        type: 'student',
        fullName: { $regex: name.replace('*', '.*'), $options: 'i' },
        groupIds: { $in: teacher.groupIds }
      }

      const data = await getData(query)

      logger('info', [id, 'api', 'students', 'caller', caller, 'search by name', 'data', data.length])

      const students = data.map(student => {
        try {
          return repackStudent(student, teacher)
        } catch (error) {
          logger('error', [id, 'api', 'students', 'caller', caller, 'search by name', 'repack-student', student.username, error.message])
        }
      }).filter(student => typeof student !== 'undefined')

      response.json(students)
    } catch (error) {
      logger('error', [id, 'api', 'students', 'caller', caller, 'search by name', error.message])
      response.status(500)
      response.json(error)
    }
  } else if (username && !action) {
    logger('info', [id, 'api', 'students', 'caller', caller, 'search by username', username, 'caller', caller, 'start'])
    try {
      // If caller is an email/UPN, check mail field instead of username
      const teacherQuery = { type: 'teacher' }
      if (caller.includes('@')) {
        teacherQuery.email = caller
      } else {
        teacherQuery.username = caller
      }

      const teachers = await getData(teacherQuery)
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
      logger('error', [id, 'api', 'students', 'caller', caller, 'search by username', error.message])
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
      logger('error', [id, 'api', 'students', 'caller', caller, 'student contactteachers', error.message])
      response.status(500)
      response.json(error)
    }
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleStudents)
