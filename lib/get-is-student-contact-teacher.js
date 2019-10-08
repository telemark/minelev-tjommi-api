module.exports = (student, teacher) => {
  if (!teacher.atferdIds || teacher.atferdIds.length === 0) return false

  // Is the teacher and student member of the same ATF-group?
  return student.groupIds.find(id => teacher.atferdIds.includes(id)).length > 0
}
