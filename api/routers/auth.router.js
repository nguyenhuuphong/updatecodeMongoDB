var express = require("express");
var router = express.Router();
const shortid = require("shortid");
const bcrypt = require('bcrypt');

var controller = require('../controllers/auth.controller');
// view home user

router.get("/login", controller.login );
//POST
router.post("/login", controller.postLogin);



module.exports = router;