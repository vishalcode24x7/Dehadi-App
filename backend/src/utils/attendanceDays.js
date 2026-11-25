const attendanceDayValues = {
  present: 1,
  half: 0.5,
  oneAndHalf: 1.5,
  double: 2,
  absent: 0,
}

function getAttendanceDays(status) {
  return attendanceDayValues[status] || 0
}

module.exports = { getAttendanceDays }
