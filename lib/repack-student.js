const getSchools = require('tfk-schools-info')

module.exports = student => {
  const { fullName, mainGroupName, groups } = student
  const unitId = mainGroupName.split(':')[0]
  const schools = getSchools({ shortName: unitId })
  const school = schools[0]

  return {
    firstName: student.givenName,
    middleName: null,
    lastName: student.familyName,
    fullName,
    personalIdNumber: student.ssn,
    mobilePhone: student.phone,
    mail: student.email,
    userName: student.username,
    contactTeacher: false,
    unitId,
    unitName: school.officialName,
    organizationNumber: school.organizationNumber,
    mainGroupName,
    groups
  }
}
