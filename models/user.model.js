var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

      name: String,
      age: Number,
      email: String,
      password: String,
      isAdmin: Boolean,
      avatar: String,
      wrong: Number

});
 
	var User = mongoose.model('User', userSchema, 'user'); // user ở cuối là tên collection trong db
	module.exports = User ;