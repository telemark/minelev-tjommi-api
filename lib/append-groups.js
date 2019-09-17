const getData = require('./get-data')

module.exports = async students => {
  const uniqueGroupIds = students.reduce((accumulator, current) => {
    const isUnique = item => !accumulator.includes(item)
    accumulator.push(...current.fagIds.filter(isUnique))
    return accumulator
  }, [])
  const groupQuery = {
    type: 'fag',
    id: { $in: uniqueGroupIds }
  }
  const groups = await getData(groupQuery)
  return students.reduce((accumulator, current) => {
    const isMyGroup = group => group.memberIds.includes(current.id)
    const myGroups = groups.filter(isMyGroup).map(group => {
      delete group.memberIds
      return group
    })
    accumulator.push(Object.assign({}, current, { groups: myGroups }))
    return accumulator
  }, [])
}
