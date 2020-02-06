const { Schema, model } = require('mongoose')

const JobSchema = new Schema({
    _id: 2,
    userId: 1,
    name: "d89bb227-d55d-4f93-83fd-d928e178fa67"
})

module.exports = model('Job', JobSchema)