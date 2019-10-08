const getSchools = require('tfk-schools-info')
const repackStudentGroup = require('./repack-student-group')
const getIsContactTeacher = require('./get-is-student-contact-teacher')

module.exports = (student, teacher) => {
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
    contactTeacher: !!getIsContactTeacher(student, teacher),
    unitId,
    unitName: school.officialName,
    organizationNumber: school.organizationNumber,
    mainGroupName,
    groups: groups.map(repackStudentGroup)
  }
}
