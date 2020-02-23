var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const { user } = require('../controllers')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth')
/* GET home page. */
router.get('/', (req, res) => {
    const { user } = req
    res.render('index', { title: 'AutoSub', user });
})

router.get('/jobs', isLoggedIn, user.getJobs)


module.exports = router;