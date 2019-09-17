const getData = require('./get-data')

module.exports = async data => {
  const uniqueGroupIds = data.reduce((accumulator, current) => {
    const isUnique = item => !accumulator.includes(item)
    accumulator.push(...current.basisgruppeIds.filter(isUnique))
    return accumulator
  }, [])
  const groupQuery = {
    type: 'basisgruppe',
    id: { $in: uniqueGroupIds }
  }
  const maingroups = await getData(groupQuery)
  const getMyMainGroup = student => {
    const group = maingroups.find(group => group.memberIds.includes(student.id))
    return group.groupId
  }
  return data.map(student => Object.assign({}, student, { mainGroupName: getMyMainGroup(student) }))
}
