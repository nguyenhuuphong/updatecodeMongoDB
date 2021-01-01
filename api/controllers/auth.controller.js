require('dotenv').config();
var multer = require('multer');
var md5 = require('md5');
var express = require("express");
var bcrypt = require('bcrypt');
//var db = require('../db');
const shortid = require("shortid");
var cookieParser = require('cookie-parser');
// required grid/mail
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var User = require('../../models/user.model.js'); 
module.exports.login = async function (req, res) {
  var user = await User.find();
  res.json(user)  ;
};

module.exports.postLogin = async function (req, res, next){
	var email = req.body.email ;
	var password = req.body.password;
	//var user = db.get('user').find({email: email}).value();
    var user = await User.findOne({email: email});
    
    	//.then(data=>{console.log(data); });
    	console.log(user)

	if(!user){
		res.render('login', {
			errors: [
                'email không tồn tại -_-'
			],
			values: req.body
		})
		return;
	}
	if (user.wrong >= 4) {
		

		const msg = {
	  		to: req.body.email,
	  		from: process.env.SENDGRID_EMAIL, // khong nen hard code
	  		subject: 'Bạn vừa nhập sai mật khẩu đăng nhập',
	  		text: 'Liên hệ admin để lấy lại mật khẩu',
	 		html: '<strong> liên hệ: gmail: infobook@gmail.com </strong>',
        };
      
		await sgMail.send(msg);

		return res.render('login', {
			errors: [`Bạn đã đăng nhập sai ${user.wrong} lần, vui lòng liên vệ với admin để khôi phục tài khoản`]
		});
	}
	var isMathPassword = await bcrypt.compare(password, user.password)
	
	if (!isMathPassword){
       	//db.get('user').find({ email: email }).assign({ wrong: user.wrong + 1 }).write();

		await User.updateOne({email: email }, { wrong: user.wrong + 1});
		return res.render('login',{
			errors: ['sai mật khẩu']
		})
	}	

	if (user.wrong > 0) {
		//db.get('user').find({ email: email }).assign({ wrong: 0 }).write();
		await User.updateOne({email: email}, {wrong: 0});
	}

	res.cookie('cookie', user.id, 
		{signed: true} );
	res.redirect('/');
}