const shortid = require("shortid");
var db = require('../db');
var express = require("express");
var Session = require("../models/session.model.js")
var Cart = require("../models/cart.model.js")

module.exports= async function (req, res, next){
	 var sessionId = req.signedCookies.sessionId;

    if (!sessionId) {
        var session = new Session();
        await session.save();

        res.cookie('sessionId', session._id, {
            signed: true
        });
    }

    var cart = await Cart.find({ session: sessionId });

    var countCart = 0;
    for (let item of cart) {
        countCart += item.quantity
    }


    res.locals.count = countCart;
    next();
}    
	/*var session = req.signedCookies.sessionId;


	if(!session){
		//const sessionCreate = await Session.create({name: "phong"});

		var sessionId = shortid.generate();

		res.cookie('sessionId', sessionId, {signed: true});

		db.get('sessions')
		  .push({ id: sessionId})
		  .write();
    }


	var totalBook = 0 ;

	var dataBook = db.get('sessions').find({id: session}).value(); 
	//var dataBook = Sesson.findOne({name: "phong"})
if(dataBook){
	for (bookId in dataBook.cart){
		totalBook += dataBook.cart[bookId]
	}    */

/*
	res.locals.count = totalBook ;
	next();*/
