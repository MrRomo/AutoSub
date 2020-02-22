const { Schema, model } = require('mongoose')

const JobSchema = new Schema({
    userId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    status: { type: String, default: 'IN_PROGRESS' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    requestTime: { type: Number, default: Date.now },
})

module.exports = model('Job', JobSchema)