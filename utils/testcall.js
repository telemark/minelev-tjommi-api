(async () => {
  require('dotenv').config()

  const axios = require('axios')
  const generateToken = require('./generate-token')
  const token = generateToken(process.env.LOGGED_IN_USER)
  axios.defaults.headers.common.Authorization = token
  const url = 'http://localhost:3000/students?name=gard'
  // const url = 'http://localhost:3000/students/{id}'
  // const url = 'http://localhost:3000/students/{id}/contactteachers'
  // const url = 'http://localhost:3000/teachers'
  // const url = 'http://localhost:3000/teachers/{id}'
  // const url = 'http://localhost:3000/teachers/{id}/contactclasses'
  // const url = 'http://localhost:3000/classes'
  // const url = 'http://localhost:3000/classes/{id}'
  // const url = 'http://localhost:3000/classes/{id}/students'
  // const url = 'http://localhost:3000/classes/{id}/teachers'
  // const url = 'http://localhost:3000/schools'
  // const url = 'http://localhost:3000/schools/{id}'
  // const url = 'http://localhost:3000/schools/{id}/teachers'
  // const url = 'http://localhost:3000/schools/{id}/students'

  try {
    const { data } = await axios.get(url)
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(error)
  }
})()
