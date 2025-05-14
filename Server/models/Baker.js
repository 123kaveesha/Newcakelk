const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  photo: { type: String, default: '/images/default-product.jpg' }
}, { timestamps: true });

const bakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  photo: { type: String, default: '/images/default-baker.jpg' },
  products: [productSchema]
}, { timestamps: true });

// Hash password before saving
bakerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
bakerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate rating based on experience
bakerSchema.methods.calculateRating = function() {
  const years = parseInt(this.experience) || 0;
  if (years >= 15) return 4.9;
  if (years >= 10) return 4.7;
  if (years >= 5) return 4.3;
  return 4.0;
};

// Update rating before saving if experience changed
bakerSchema.pre('save', function(next) {
  if (this.isModified('experience')) {
    this.rating = this.calculateRating();
  }
  next();
});

module.exports = mongoose.model('Baker', bakerSchema);