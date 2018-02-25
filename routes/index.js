var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Node-passport-sqlite example', user:{} });
});

module.exports = router;
