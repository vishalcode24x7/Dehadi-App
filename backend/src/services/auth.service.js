const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')
const { createToken } = require('../utils/token')

const LOCKOUT_MINUTES = 15
const MAX_FAILED_ATTEMPTS = 5

function assertNotLocked(user) {
  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw new ApiError(423, 'Account temporarily locked')
  }
}

async function recordFailedAttempt(user) {
  const failedPinAttempts = (user.failedPinAttempts || 0) + 1
  const updates = { failedPinAttempts }

  if (failedPinAttempts >= MAX_FAILED_ATTEMPTS) {
    updates.lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
  }

  await User.updateOne({ _id: user._id }, { $set: updates })
  user.failedPinAttempts = failedPinAttempts
  if (updates.lockUntil) {
    user.lockUntil = updates.lockUntil
  }
}

async function resetFailedAttempts(user) {
  await User.updateOne(
    { _id: user._id },
    { $set: { failedPinAttempts: 0, lockUntil: null } },
  )
}

async function register(input) {
  const pinHash = await bcrypt.hash(input.pin, 10)
  const user = await User.create({
    name: input.name,
    phone: input.phone,
    pinHash,
    role: 'contractor',
  })

  return {
    token: createToken(user),
    user: user.toJSON(),
  }
}

async function loginPin(input) {
  const user = await User.findOne({ phone: input.phone, isActive: true })
  if (!user || !user.pinHash) {
    throw new ApiError(401, 'Phone ya PIN galat hai')
  }

  assertNotLocked(user)

  const isValid = await bcrypt.compare(input.pin, user.pinHash)
  if (!isValid) {
    await recordFailedAttempt(user)
    if (user.failedPinAttempts >= MAX_FAILED_ATTEMPTS) {
      throw new ApiError(423, 'Account temporarily locked')
    }
    throw new ApiError(401, 'Phone ya PIN galat hai')
  }

  await resetFailedAttempts(user)
  return {
    token: createToken(user),
    user: user.toJSON(),
  }
}

async function getMe(user) {
  return { user: user.toJSON() }
}

async function changePin(user, input) {
  assertNotLocked(user)

  if (user.pinHash) {
    let isValid = false
    if (input.currentPin) {
      isValid = await bcrypt.compare(input.currentPin, user.pinHash)
    } else if (input.currentPassword && user.passwordHash) {
      isValid = await bcrypt.compare(input.currentPassword, user.passwordHash)
    }
    if (!isValid) {
      await recordFailedAttempt(user)
      throw new ApiError(401, 'Current PIN or password is incorrect')
    }
  } else if (input.currentPassword) {
    if (!user.passwordHash) {
      throw new ApiError(400, 'Current password is required')
    }
    const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash)
    if (!isValid) {
      await recordFailedAttempt(user)
      throw new ApiError(401, 'Current PIN or password is incorrect')
    }
  } else if (user.role === 'contractor') {
    throw new ApiError(400, 'Current password is required')
  } else {
    throw new ApiError(400, 'Current PIN or password is required')
  }

  const pinHash = await bcrypt.hash(input.newPin, 10)
  user.pinHash = pinHash
  await resetFailedAttempts(user)
  await user.save()

  return { user: user.toJSON() }
}

module.exports = {
  register,
  loginPin,
  getMe,
  changePin,
}
