const mongoose = require('mongoose');
const Product = require('./Product');

const bakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.0
  },
  photo: {
    type: String,
    default: '/images/default-baker.jpg'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  role: {
    type: String,
    enum: ['customer', 'manufacturer', 'instructor'],
    default: 'manufacturer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to delete associated products when a baker is removed
bakerSchema.pre('remove', async function(next) {
  try {
    await Product.deleteMany({ _id: { $in: this.products } });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Baker', bakerSchema);