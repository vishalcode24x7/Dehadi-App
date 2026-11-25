const express = require('express')
const auth = require('../middlewares/auth')
const requireRole = require('../middlewares/requireRole')
const validate = require('../middlewares/validate')
const { querySchema, createSchema } = require('../validators/money.validator')
const createMoneyController = require('../controllers/money.controller')

function validateQuery(req, res, next) {
  const result = querySchema.safeParse(req.query)
  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || 'Invalid data')
    error.statusCode = 400
    next(error)
    return
  }
  req.validatedQuery = result.data
  next()
}

function createMoneyRoutes(service) {
  const router = express.Router()
  const controller = createMoneyController(service)

  router.use(auth, requireRole('contractor'))
  router.get('/', validateQuery, controller.list)
  router.post('/', validate(createSchema), controller.create)
  router.delete('/:id', controller.remove)

  return router
}

module.exports = createMoneyRoutes
