const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: '/images/default-product.jpg'
  },
  baker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baker',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);