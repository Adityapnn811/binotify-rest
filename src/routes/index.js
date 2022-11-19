var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Homepage")
  res.status(200).send("<p>Homepage edited yay 2 dasdasdasd</p>");
});

module.exports = router;
