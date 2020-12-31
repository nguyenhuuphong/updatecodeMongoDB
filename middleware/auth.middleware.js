var express = require("express");
//var db = require('../db');
const shortid = require("shortid");
var cookieParser = require('cookie-parser');
var User = require('../models/user.model.js'); 

module.exports.requireAuth = async function (req, res, next){
    if(!req.signedCookies.cookie){
 		res.redirect('/auth/login');
 		return;
    }
    //var user = db.get('user').find({id: req.signedCookies.cookie}).value();
    
    var user = await User.findOne({_id : req.signedCookies.cookie});

    if(!user){
        res.redirect('/auth/login')
        return;
    }
    res.locals.user = user;
    next();
}
