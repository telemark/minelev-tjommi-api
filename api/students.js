module.exports = async (request, response) => {
  const query = await request.query
  const url = request.url
  const username = url.split('/')[2]
  const action = url.split('/')[3]
  const data = { ...query, username, action }
  response.json(data)
}
