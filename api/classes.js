const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')
const repackStudent = require('../lib/repack-student')

const handleClasses = async (request, response) => {
  const url = request.url
  const classId = url.split('/')[2]
  const action = url.split('/')[3]
  let query = false

  if (!classId && !action) {
    query = {
      type: 'basisgruppe'
    }
  }

  if (classId && !action) {
    query = {
      type: 'basisgruppe',
      groupId: classId
    }
  }

  if (classId && action && ['students', 'teachers'].includes(action)) {
    const classes = await getData({
      type: 'basisgruppe',
      groupId: classId
    })
    query = {
      groupIds: classes[0].id,
      type: action === 'students' ? 'student' : 'teacher'
    }
  }

  if (query) {
    let data = await getData(query)
    if (action === 'students') {
      data = data.map(repackStudent)
    }
    response.json(data)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleClasses)
