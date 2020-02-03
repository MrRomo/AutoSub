const router = require('express').Router()
const job = require('../controllers/job')


router.post('/upload', multerUploader.single('file'), job.processVideo);


module.exports = router