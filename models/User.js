const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    photo: { type: String, default: 'default.png' },
    isAdmin: { type: Boolean, default: false },
    jobs: { type: Number, default: 0 },
    lastSign: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = model('User', UserSchema)