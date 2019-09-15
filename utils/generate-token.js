const jwt = require('jsonwebtoken')
const { name, version } = require('../package.json')

module.exports = userId => {
  const payload = {
    system: name,
    version: version,
    caller: userId
  }

  const options = {
    expiresIn: '1m',
    issuer: 'https://auth.t-fk.no'
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, options)

  return `Bearer ${token}`
}
