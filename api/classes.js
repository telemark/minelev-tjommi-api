module.exports = async (request, response) => {
  const url = request.url
  const classId = url.split('/')[2]
  const action = url.split('/')[3]
  const data = { classId, action }
  response.json(data)
}
