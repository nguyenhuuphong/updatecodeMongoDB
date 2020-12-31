var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({

    title: String,
    des: String,
    coverUrl: String,

});

	var Book = mongoose.model('Book',bookSchema, 'books'); // books ở cuối là tên collection trong db
	module.exports = Book ;