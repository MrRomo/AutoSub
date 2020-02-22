var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    const { user } = req
    console.log(user);    
    res.render('index', { title: 'Amigo Secreto Online', user});
})


module.exports = router;