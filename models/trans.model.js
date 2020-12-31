var mongoose = require('mongoose');

var transSchema = new mongoose.Schema({

    userId: String,
    bookId: String,
    isComplete: Boolean
});

	var Tran = mongoose.model('Trans',transSchema, 'trans'); // trans ở cuối là tên collection trong db
	module.exports = Tran ;