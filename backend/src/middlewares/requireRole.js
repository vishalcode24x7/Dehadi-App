const ApiError = require('../utils/ApiError')

function requireRole(role) {
  return (req, _res, next) => {
    if (req.user?.role !== role) {
      throw new ApiError(403, 'Forbidden')
    }
    next()
  }
}

module.exports = requireRole
