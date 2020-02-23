const mongoose = require('mongoose')


class mongo_db {

    constructor(env) {
        console.log('Connecting db...');
        mongoose.connect(env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
            .then(db => console.log('DB is connected'))
            .catch(err => console.error(err))
        mongoose.Promise = global.Promise;
        this.connection = mongoose.connection
    }

    async sendError(error) {
        if (error.message) {
            return { data: null, message: `Error: ${error.message}`, error }
        } else {
            return { data: null, error }
        }
    }

    async getOne(query, Schema, options) {
        try {
            let data = await Schema.findById(query)
            return { data }
        } catch (error) {
            return this.sendError(error)
        }
    }
    async get(query, Schema, options) {
        const { sort } = options || "-1"
        const { limit } = options || 1
        try {
            let data = await Schema.find(query)
                .sort(sort)
                .limit(limit)
            return { data }
        } catch (error) {
            return this.sendError(error)
        }
    }
    async create(object, Schema) {
        try {
            let data = new Schema(object)
            const saveData = await data.save()
            return { data: saveData, message: 'Object Created' }
        } catch (error) {
            return this.sendError(error)
        }
    }
    async update({ query, options, array }, Schema) {
        try {
            const update = await Schema.updateOne(query, options, array || {})
            let data = await this.get(query, Schema, {})
            return { data: data.data, message: 'Object updated' }

        } catch (error) {
            return this.sendError(error)
        }
    }
    async delete(query, Schema) {
        try {
            await Schema.deleteMany(query)
            return { message: 'All documents were deleted' }
        } catch (error) {
            return this.sendError(error)
        }
    }
}

module.exports = mongo_db