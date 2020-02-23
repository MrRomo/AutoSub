var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const upload = require('../config/multer_config')
const {job} = require('../controllers')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth')

    /* GET home page. */
router.post('/upload', isLoggedIn, multerUploader.single('file'), job.processVideo)
router.get('/jobs', isLoggedIn, job.getJobs)

module.exports = router;