var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const upload = require('../config/multer_config')
const {job} = require('../controllers')

    /* GET home page. */
router.post('/upload', multerUploader.single('file'), job.processVideo)


module.exports = router;