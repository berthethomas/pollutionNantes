var express = require('express'),
        router = express.Router(),
        Pollution = require('../models/Pollution');

router.get('/', function (req, res, next) {

    Pollution.getPollution(function (pollution) {
        console.log(pollution);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(pollution));
    })
});

module.exports = router;
