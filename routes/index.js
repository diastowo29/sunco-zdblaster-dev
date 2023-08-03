var express = require('express');
var router = express.Router();
const db = require("../models");
const History = db.histories;
const Op = db.Sequelize.Op;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/db', function(req, res, next) {
  History.findAll().then(function(histories) {
    res.status(200).send({ data: histories })
  })
})

module.exports = router;
