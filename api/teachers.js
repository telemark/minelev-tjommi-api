module.exports = async (request, response) => {
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  const data = { username, action }
  response.json(data)
}
