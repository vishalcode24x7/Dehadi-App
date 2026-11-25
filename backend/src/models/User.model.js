const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{10}$/,
    },
    passwordHash: { type: String },
    pinHash: { type: String },
    role: {
      type: String,
      enum: ['contractor', 'worker'],
      required: true,
    },
    contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workerType: {
      type: String,
      enum: ['mistri', 'labour'],
    },
    dailyWage: { type: Number },
    isActive: { type: Boolean, default: true },
    failedPinAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true },
)

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    delete returnedObject.passwordHash
    delete returnedObject.pinHash
    delete returnedObject.failedPinAttempts
    delete returnedObject.lockUntil
    delete returnedObject.__v
    return returnedObject
  },
})

module.exports = mongoose.model('User', userSchema)
