var multer = require('multer');

var bcrypt = require('bcrypt');
var express = require("express");
const shortid = require("shortid");
//var db = require('../db');
//var md5 = require('md5');

var cloudinary = require('cloudinary').v2;
var upload = multer({ dest :'uploads' })
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
//CLOUDINARY_URL=cloudinary://631582236334719:nWLwsQb6uA5OMqHgSVo2fY-UQdA@kon-tum
var User = require("../models/user.model.js");

module.exports.index = async function (req, res) {
  /*var users = db.get('user').value();
  res.render("user", {
      users
  });*/
  var users = await User.find();
      res.render( "user", {
         users: users
      })
  
};
// add new user
module.exports.add = function(req, res) {
  res.render("useradd");
};

module.exports.addPost = async function (req, res){
  req.body.id = shortid.generate();   
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email ; 
  var password = req.body.password;
  var age = req.body.age;
 /*
  if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path);
            req.body.avatar = secure_url;
        } else {
            req.body.avatar = '/uploads/default.jpg';
        }*/
  req.body.avatar = req.file.path.split('\\').join('/')
  var image = await cloudinary.uploader.upload(req.file.path)


  //var hash = md5(password); // bảo mật dữ liệu bằng md5 
   const saltRounds = 10;
   const hash = await bcrypt.hash(password, saltRounds);

   var errors = []
   //var user = db.get('user').find({email: email}).value(); //lấy email từ database
   var user = await User.findOne({email: email});


   //validate 
   if (user){
     errors.push("Email already exists");  // kiểu tra email có tồn tại trong database chưa
   }
   if (!req.body.name || req.body.name.length > 30){
     errors.push("Name is required")
   }
   if ( req.body.name.length > 30){
     errors.push("tên bạn dài hơn 30 ký tự")
   }
   if (!req.body.age){
     errors.push("Age is required")
   }
   if (!req.body.age || req.body.age < 12 && req.body.age > 100 ){
     errors.push("Age not < 12 && > 100")
   }
   if (!req.body.email){
     errors.push("email is required")
   }
   if (!req.body.password){
   } 
   if (errors.length){
      return res.render("useradd",{
       errors: errors,
       values: req.body
      });
    }
     var isAdmin = JSON.parse(req.body.isAdmin); // ep string sang boolean
    await User.create({name: name, age: parseInt(age)
      , email: email, password: hash,isAdmin: isAdmin,avatar: image.secure_url ,wrong: 0})
     /* db.get('user') 
       .push({id: id, name: name, age: parseInt(age), email: email, password: hash,isAdmin: isAdmin,avatar: image.secure_url ,wrong: 0})
       .write();*/  // lưu biến hash password: hash => dùng bcrypt
    res.redirect("/user");
};
// xóa người thuê
module.exports.idDelete = async function (req, res){
  var id = req.params.id;
  /*var getData =  db
     .get("user")
    .remove({ id: id })
    .write();*/

  await User.findOneAndRemove({_id: id});
  res.redirect("/user")
  };
// show thông tin
module.exports.show = async function (req, res){
  var getId = req.params.id;
  /*var getData = db
    .get("user")
    .find({ id: getId })
    .value();*/
    var getData = await User.findOne({_id: getId});

  res.render("usershow", {
    user: getData
  });
};
module.exports.idUpdate = async function(req, res) {
   var getId = req.params.id;
 /* var getData = db
    .get("user")
    .find({ id: getId })
    .value();*/
  var getData = await User.findById(getId);
  res.render("userupdate", {
    data: getData
  });
};

module.exports.idUpdatePost = async function (req, res){
  var id = req.params.id;
  var name = req.body.name;
  var age = req.body.age;
  var email = req.body.email; // indefined 
  var password = req.body.password;
  var isAdmin = req.body.isAdmin == "true";

  /*var user;
 if (req.file ) {
  req.body.avatar = req.file.path.split('\\').join('/');
  var imageUploaded = await cloudinary.uploader.upload(req.file.path);

   user = db.get('user')
  .find({ id: req.params.id })
  .assign({ name: name, age: age, email:email, password: password,
        isAdmin: isAdmin,avatar: imageUploaded , wrong: 0})
  .write() 
 }else {
   user = db.get('user')
    .find({ id: req.params.id })
    .assign({ name: name, age: age, email:email, password: password,
          isAdmin: isAdmin, wrong: 0})
    .write() 
 }*/
  var user;
 if (req.file ) {
  req.body.avatar = req.file.path.split('\\').join('/');
  var imageUploaded = await cloudinary.uploader.upload(req.file.path);


  await User.findOneAndUpdate({_id: id}, {name: name, age: age, email:email, password: password,
        isAdmin: isAdmin,avatar: imageUploaded , wrong: 0});
 
 }else {
   await User.findOneAndUpdate({_id: id},{name: name, age: age, email:email, password: password,
          isAdmin: isAdmin, wrong: 0});
 }
  res.redirect("/user");
};
