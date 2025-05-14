const express = require('express');
const router = express.Router();
const Baker = require('../models/Baker');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Register a new baker
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, experience, location, specialty } = req.body;
    
    // Check if baker exists
    let baker = await Baker.findOne({ email });
    if (baker) {
      return res.status(400).json({ msg: 'Baker already exists' });
    }
    
    // Create new baker
    baker = new Baker({
      name,
      email,
      password,
      experience: `${experience} years`,
      location,
      specialty
    });
    
    // Save baker
    await baker.save();
    
    // Create token
    const token = await baker.generateAuthToken();
    
    res.status(201).json({ baker, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login baker
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find baker by email
    const baker = await Baker.findOne({ email });
    if (!baker) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await baker.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create token
    const token = await baker.generateAuthToken();
    
    res.json({ baker, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

 // Get all bakers
router.get('/', async (req, res) => {
    try {
        const bakers = await Baker.find({});
        res.json(bakers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get single baker
router.get('/:id', async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.id).select('-password');
    if (!baker) {
      return res.status(404).json({ msg: 'Baker not found' });
    }
    res.json(baker);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Baker not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update baker profile (authenticated)
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, experience, location, specialty } = req.body;
    let photo = req.baker.photo;
    
    if (req.file) {
      photo = `/images/${req.file.filename}`;
    }
    
    const baker = await Baker.findByIdAndUpdate(
      req.params.id,
      { 
        name,
        experience: `${experience} years`,
        location,
        specialty,
        photo
      },
      { new: true }
    ).select('-password');
    
    if (!baker) {
      return res.status(404).json({ msg: 'Baker not found' });
    }
    
    res.json(baker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add product to baker (authenticated)
router.post('/:id/products', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    let photo = '/images/default-product.jpg';
    
    if (req.file) {
      photo = `/images/${req.file.filename}`;
    }
    
    const newProduct = {
      name,
      price,
      description,
      photo
    };
    
    const baker = await Baker.findByIdAndUpdate(
      req.params.id,
      { $push: { products: newProduct } },
      { new: true }
    ).select('-password');
    
    if (!baker) {
      return res.status(404).json({ msg: 'Baker not found' });
    }
    
    res.json(baker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove product from baker (authenticated)
router.delete('/:bakerId/products/:productId', auth, async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.bakerId);
    
    if (!baker) {
      return res.status(404).json({ msg: 'Baker not found' });
    }
    
    // Check if product exists
    const productIndex = baker.products.findIndex(
      product => product._id.toString() === req.params.productId
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    // Remove product
    baker.products.splice(productIndex, 1);
    await baker.save();
    
    res.json(baker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;