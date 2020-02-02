const { Schema, model } = require('mongoose')

const FileSchema = new Schema({
    userId: { type: String, unique: true, required: true },
    bucket: { type: String, required: true },
    key: { type: String, required: true },
    filename: { type: String, required: true },
    ext: { type: String, required: true },
    size: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = model('File', FileSchema)