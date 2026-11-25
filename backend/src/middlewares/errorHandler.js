const mongoose = require('mongoose')
const ApiError = require('../utils/ApiError')

function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Server error'

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Invalid data'
  }

  if (error.code === 11000) {
    statusCode = 409
    message = 'Phone already registered'
  }

  if (!(error instanceof ApiError) && statusCode === 500) {
    message = 'Server error'
  }

  res.status(statusCode).json({ success: false, message })
}

module.exports = errorHandler
