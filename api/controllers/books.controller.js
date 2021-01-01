var multer = require('multer');

var express = require("express");
//var db = require('../db');
const shortid = require("shortid");
var cloudinary = require('cloudinary').v2;
 
var Book = require('../../models/book.model.js'); 
var upload = multer({ dest :'uploads' })
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
module.exports.home = async function (req, res){
    var books = await Book.find();  
    res.json(books);
  }  
module.exports.apiPost = async function (req, res){
	var books = await Book.create(req.body);
	res.json(books);
}  
//module.exports.apiPost = async function (req, res){
	//var books = await Book.
