const utils = {}
const { promisify } = require('util')
const fs = require('fs-extra')
const readFile = promisify(fs.readFile)


utils.prepareFile = async (req) => {
    const { path } = req.file
    const data = await utils.readFile(path)
    await utils.deleteFile(path)
    const filePath = `AutoSub/${req.user.id}`
    return {
        data,
        params: {
            path: filePath,
            result: null,
            database: null,
            error: null
        }
    }
}

utils.readFile = async (path) => {
    return await readFile(path)
}
utils.deleteFile = async (path) => {
    return await fs.unlink(path)
}


module.exports = utils