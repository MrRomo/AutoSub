const { Schema, model } = require('mongoose')

const JobSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    jobName: { type: String, required: true },
    Key: {type: String},
    Bucket: {type: String},
    status: { type: String, default: 'IN_PROGRESS' },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    requestTime: { type: Number, default: Date.now },
})

module.exports = model('Job', JobSchema)