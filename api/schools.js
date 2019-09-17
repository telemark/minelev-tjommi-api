const withTokenAuth = require('../lib/token-auth')
const getData = require('../lib/get-data')

const handleSchools = async (request, response) => {
  const url = request.url
  const schoolId = url.split('/')[2]
  const action = url.split('/')[3]
  let query = false
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
    const schools = await getData({
      schoolId: schoolId,
      type: 'skole'
    })
    query = {
      schoolIds: schools[0].id,
      type: action === 'students' ? 'student' : 'teacher'
    }
  }
  if (query) {
    const data = await getData(query)
    response.json(data)
  } else {
    response.status(400)
    response.send('No query created')
  }
}

module.exports = (request, response) => withTokenAuth(request, response, handleSchools)
