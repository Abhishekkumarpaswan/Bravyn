const mongoose = require('mongoose');
// Define a Mongoose schema and model
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports=Product;