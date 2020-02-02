const router = require('express').Router()
const media = require('../controllers/media')


router.post('/upload', multerUploader.single('file'), media.processVideo);


module.exports = router