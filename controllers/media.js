const crtl = {}
const { promisify } = require('util')
const fs = require('fs-extra')
const readFile = promisify(fs.readFile)
const uploader_s3 = require('../services/uploader').uploader_s3

const uploader = new uploader_s3(process.env)

crtl.processVideo = async (req, res) => {
    const { path } = req.file
    const data = await readFile(path)
    const params = {
        path: `AutoSub`,
        result: null,
        database: null,
        error: null
    }
    await fs.unlink(path)
    const result = await uploader.upload(data, params, false)
    console.log(result);
    res.json(result)
}


module.exports = crtl