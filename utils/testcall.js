(async () => {
  require('dotenv').config()

  const axios = require('axios')
  const generateToken = require('./generate-token')
  const token = generateToken(process.env.LOGGED_IN_USER)
  axios.defaults.headers.common.Authorization = token
  const url = 'http://localhost:3000/schools'
  try {
    const { data } = await axios.get(url)
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(error)
  }
})()
