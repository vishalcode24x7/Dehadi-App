const mongoose = require('mongoose')
const KhorakiGroup = require('../models/KhorakiGroup.model')
const Khoraki = require('../models/Khoraki.model')
const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')

function getGroupEntries(group) {
  return group.entries.length
    ? group.entries
    : [{ amount: group.amount, date: group.date }]
}

function sumEntries(entries) {
  const totalCents = entries.reduce(
    (total, entry) => total + Math.round(Number(entry.amount) * 100),
    0,
  )
  return totalCents / 100
}

async function listGroups(contractorId) {
  return KhorakiGroup.find({ contractorId }).sort({ createdAt: -1 })
}

async function createGroup(contractorId, input) {
  const uniqueIds = [...new Set(input.workerIds)]
  if (uniqueIds.some((id) => !mongoose.isValidObjectId(id))) {
    throw new ApiError(400, 'Invalid worker')
  }

  const workers = await User.find({
    _id: { $in: uniqueIds },
    role: 'worker',
    contractorId,
    isActive: true,
  })
  if (workers.length !== uniqueIds.length) {
    throw new ApiError(404, 'Worker not found')
  }

  return KhorakiGroup.create({
    name: input.name,
    contractorId,
    workerIds: uniqueIds,
    amount: sumEntries(input.entries),
    entries: input.entries,
    date: input.entries[0].date,
    note: input.note,
  })
}

async function addGroupEntry(contractorId, groupId, input) {
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(400, 'Invalid group')
  }

  const group = await KhorakiGroup.findOne({ _id: groupId, contractorId })
  if (!group) {
    throw new ApiError(404, 'Group not found')
  }
  if (group.status === 'closed') {
    throw new ApiError(409, 'Group already divided')
  }

  const entries = [...getGroupEntries(group), input]
  group.entries = entries
  group.amount = sumEntries(entries)
  await group.save()
  return group
}

async function divideGroup(contractorId, groupId, divideDate) {
  if (!mongoose.isValidObjectId(groupId)) {
    throw new ApiError(400, 'Invalid group')
  }

  const group = await KhorakiGroup.findOne({
    _id: groupId,
    contractorId,
  })
  if (!group) {
    throw new ApiError(404, 'Group not found')
  }
  if (group.status === 'closed') {
    throw new ApiError(409, 'Group already divided')
  }

  const workerCount = group.workerIds.length
  const totalCents = getGroupEntries(group).reduce(
    (total, entry) => total + Math.round(Number(entry.amount) * 100),
    0,
  )
  const baseCents = Math.floor(totalCents / workerCount)
  const remainderCents = totalCents - baseCents * workerCount

  const entries = group.workerIds.map((workerId, index) => ({
    workerId,
    contractorId,
    amount: (baseCents + (index < remainderCents ? 1 : 0)) / 100,
    date: divideDate,
    note: group.note
      ? `${group.name}: ${group.note}`
      : group.name,
  }))

  await Khoraki.insertMany(entries)
  group.status = 'closed'
  group.dividedDate = divideDate
  await group.save()

  return group
}

module.exports = {
  listGroups,
  createGroup,
  addGroupEntry,
  divideGroup,
}
