const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')

const handleTeachers = async (request, response) => {
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]

  if (!username && !action) {
    const query = {
      type: 'teacher'
    }
    const data = await getData(query)
    response.json(data)
  } else if (username && !action) {
    const query = {
      username: username,
      type: 'teacher'
    }
    const data = await getData(query)
    response.json(data)
  } else if (username && action && ['contactclasses'].includes(action)) {
    const teacherQuery = {
      username: username,
      type: 'teacher'
    }
    const teachers = await getData(teacherQuery)
    const teacher = teachers[0]
    const groupQuery = {
      memberIds: teacher.id
    }
    // TODO: Implement a way to filter out contactclasses
    const groups = await getData(groupQuery)
    response.json(groups)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleTeachers)
