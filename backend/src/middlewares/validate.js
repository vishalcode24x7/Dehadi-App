function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Invalid data'
      const error = new Error(message)
      error.statusCode = 400
      next(error)
      return
    }
    req.body = result.data
    next()
  }
}

module.exports = validate
