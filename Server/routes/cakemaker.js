const express = require('express');
const router = express.Router();
const Cakemaker = require('../models/Cakemaker');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new cakemaker
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password should be at least 6 characters' });
    }

    // Check if user exists
    const existingCakemaker = await Cakemaker.findOne({ email });
    if (existingCakemaker) {
      return res.status(400).json({ msg: 'Cakemaker already exists' });
    }

    // Create new cakemaker
    const newCakemaker = new Cakemaker({
      name,
      email,
      password // Password will be hashed by the pre-save hook
    });

    // Save to database
    const savedCakemaker = await newCakemaker.save();

    // Create token
    const token = jwt.sign(
      { id: savedCakemaker._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and user info (without password)
    res.json({
      token,
      cakemaker: {
        id: savedCakemaker._id,
        name: savedCakemaker.name,
        email: savedCakemaker.email,
        photo: savedCakemaker.photo
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login cakemaker
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for cakemaker
    const cakemaker = await Cakemaker.findOne({ email });
    if (!cakemaker) {
      return res.status(400).json({ msg: 'Cakemaker does not exist' });
    }

    // Validate password
    const isMatch = await cakemaker.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: cakemaker._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and user info (without password)
    res.json({
      token,
      cakemaker: {
        id: cakemaker._id,
        name: cakemaker.name,
        email: cakemaker.email,
        photo: cakemaker.photo,
        experience: cakemaker.experience,
        location: cakemaker.location,
        specialty: cakemaker.specialty,
        rating: cakemaker.rating,
        products: cakemaker.products
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/auth/cakemaker
// @desc    Get cakemaker data
router.get('/cakemaker', auth, async (req, res) => {
  try {
    const cakemaker = await Cakemaker.findById(req.cakemaker.id).select('-password');
    res.json(cakemaker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update cakemaker profile
router.put('/update-profile', auth, async (req, res) => {
  const { name, experience, location, specialty, photo } = req.body;

  try {
    // Calculate rating based on experience
    const calculateRating = (exp) => {
      const years = parseInt(exp) || 0;
      if (years >= 15) return 4.9;
      if (years >= 10) return 4.7;
      if (years >= 5) return 4.3;
      return 4.0;
    };

    const updatedProfile = {
      name,
      experience: `${experience} years`,
      location,
      specialty,
      rating: calculateRating(experience),
      photo
    };

    const updatedCakemaker = await Cakemaker.findByIdAndUpdate(
      req.cakemaker.id,
      { $set: updatedProfile },
      { new: true }
    ).select('-password');

    res.json(updatedCakemaker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/auth/cakemakers
// @desc    Get all cakemakers
router.get('/cakemakers', async (req, res) => {
  try {
    const cakemakers = await Cakemaker.find().select('-password');
    res.json(cakemakers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/cakemakers/:id/products
// @desc    Add product to cakemaker
router.post('/cakemakers/:id/products', auth, async (req, res) => {
  try {
    const cakemaker = await Cakemaker.findById(req.params.id);
    
    if (!cakemaker) {
      return res.status(404).json({ msg: 'Cakemaker not found' });
    }
    
    // Check if the logged in user is the owner
    if (cakemaker._id.toString() !== req.cakemaker.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      photo: req.body.photo
    };
    
    cakemaker.products.push(newProduct);
    await cakemaker.save();
    
    res.json(cakemaker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/auth/cakemakers/:id/products/:productId
// @desc    Remove product from cakemaker
router.delete('/cakemakers/:id/products/:productId', auth, async (req, res) => {
  try {
    const cakemaker = await Cakemaker.findById(req.params.id);
    
    if (!cakemaker) {
      return res.status(404).json({ msg: 'Cakemaker not found' });
    }
    
    // Check if the logged in user is the owner
    if (cakemaker._id.toString() !== req.cakemaker.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Remove the product
    cakemaker.products = cakemaker.products.filter(
      product => product._id.toString() !== req.params.productId
    );
    
    await cakemaker.save();
    
    res.json(cakemaker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;