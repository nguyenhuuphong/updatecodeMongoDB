var express = require("express");
var db = require('../db');
const shortid = require("shortid");
var cookieParser = require('cookie-parser');
//var db = require('../db');
  
var User = require('../models/user.model');
var Book = require('../models/book.model');
var Session = require('../models/session.model.js');
var Tran = require('../models/trans.model');
var Cart = require("../models/cart.model.js");

module.exports.addToCart = async function (req, res, next){
     /* var bookId = req.params.bookId;
      var sessionId = req.signedCookies.sessionId;

      if(!sessionId){
      	res.redirect('/books')
        return;
      }

      var count =  db
        .get('sessions')
        .find({id: sessionId})
        .get('cart.' + bookId, 0)
        .value();

        db.get('sessions')
          .find({id: sessionId})
          .set('cart.'+ bookId, count + 1)
          .write();*/
    try {

        var bookId = req.params.bookId; // lay id cua book
        var sessionId = req.signedCookies.sessionId; // lay id cua session

        if (!sessionId) {
            return res.redirect('/books');
        }

        // B1 Click button add to cart
        // B2 Kiem tra xem cart da ton tai hay chua
        // Neu cart ko ton tai thi tao moi
        // Neu cart da ton tai roi => update so luong len 1 don vi

        var isExistedCart = await Cart.findOne({ book: bookId, session: sessionId });

        if (!isExistedCart) {
            const cart = new Cart({ book: bookId, session: sessionId })
            await cart.save();
            return res.redirect('/books');
        }

        await Cart.findOneAndUpdate({ _id: isExistedCart._id }, {
            $inc: {
                quantity: 1
            }
        });

        res.redirect('/books');
    } catch (error) {
        console.log(error);
    }

};
module.exports.viewCart =async function (req, res){

  
    try {
        var cart = await Cart.find()
            .populate({ path: 'book', select: 'title' });

        res.render('cart', {
            cart : cart,
        });

    } catch (error) {
        res.status(500).send('Something Broke!');
        next(error);
    }

      /*  var sessionId = req.signedCookies.sessionId;
        var session = db.get('sessions')
            .find({ id: sessionId })
            .value();

        var books = db.get('books').value();
        var results = [];

        console.log(session, sessionId)

        var convertCart = Object.keys(session.cart);

        convertCart.map(function(key) {
            var obj = {
                id: key,
                quantity: session.cart[key]
            }

            books.map(function(book) {
                if (obj.id === book.id) {
                    return obj.title = book.title;
                }
            });

            return results.push(obj);
        });

        res.render('cart', {
            cart: results
        });
        console.log(results)*/

}
