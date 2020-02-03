const { Schema, model } = require('mongoose')

const JobSchema = new Schema({
    _id: 2,
    userId: 1,
    name: "test"
})

module.exports = model('Job', JobSchema)