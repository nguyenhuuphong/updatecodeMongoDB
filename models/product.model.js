var mongoose = require('mongoose');

var productSchema = new mongoose.Schema(
 {
      name: String,
      price: Number,
      quantity: Number,
      status: Boolean
    },
    {
        versionKey: false
    }

);

	var Product = mongoose.model('Product', productSchema, 'products'); // books ở cuối là tên collection trong db
	module.exports = Product ;