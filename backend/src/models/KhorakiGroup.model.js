const mongoose = require('mongoose')

const groupEntrySchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  { _id: false },
)

const khorakiGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    amount: { type: Number, required: true, min: 0 },
    entries: { type: [groupEntrySchema], default: [] },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    dividedDate: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('KhorakiGroup', khorakiGroupSchema)
