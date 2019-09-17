const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')
const appendMainGroupName = require('../lib/append-main-group-name')
const appendGroups = require('../lib/append-groups')
const logger = require('../lib/logger')

const handleStudents = async (request, response) => {
  const { caller } = request.token
  const { name } = await request.query
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]

  if (name) {
    logger('info', ['api', 'students', 'search by name', 'caller', caller, 'start'])
    const teachers = await getData({ type: 'teacher', username: caller })
    const teacher = teachers[0]
    const teachersGroups = new Set(teacher.groupIds)
    const query = {
      type: 'student',
      fullName: { $regex: name, $options: 'i' }
    }
    const data = await getData(query)
    const isMyStudent = student => {
      const studentsGroups = new Set(student.groupIds)
      const intersection = new Set([...teachersGroups].filter(groupId => studentsGroups.has(groupId)))
      return intersection.size > 0
    }
    const myStudents = data.filter(isMyStudent)
    const students = await appendMainGroupName(myStudents)
    response.json(students)
  } else if (username && !action) {
    logger('info', ['api', 'students', 'search by username', username, 'caller', caller, 'start'])
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
    const students = await appendMainGroupName(myStudents)
    const studentsWithGroups = await appendGroups(students)
    response.json(studentsWithGroups)
  } else if (username && action && ['contactteachers'].includes(action)) {
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
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleStudents)
