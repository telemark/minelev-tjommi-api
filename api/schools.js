module.exports = async (request, response) => {
  const url = request.url
  const schoolId = url.split('/')[2]
  const action = url.split('/')[3]
  const data = { schoolId, action }
  response.json(data)
}
