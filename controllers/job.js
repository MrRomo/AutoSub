const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)

crtl.processVideo = async (req, res) => {
    console.log('Processing video¡¡', req.file);
    
    const { path } = req.file
    const { params, data } = prepareFile(path)
    try {
        const { database } = await uploader.upload(data, params, false)
        console.log(database);
        res.json(database)
    } catch (error) {
        res.json(error)
    }
}


module.exports = crtl