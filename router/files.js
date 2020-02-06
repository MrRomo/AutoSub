const router = require('express').Router()
const job = require('../controllers/job')


router.post('/upload', multerUploader.single('file'), job.processVideo);
router.get('/job/:id', job.getJob);


module.exports = router