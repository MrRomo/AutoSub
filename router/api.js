var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();

const {job} = require('../controllers')

    /* GET home page. */
router.get('/upload', multerUploader.single('file'), job.processVideo)


module.exports = router;