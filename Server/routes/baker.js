// Updated bakers router with improved authentication handling
const express = require('express');
const router = express.Router();
const Baker = require('../models/Baker');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// Get all bakers
router.get('/', async (req, res) => {
  try {
    const bakers = await Baker.find().populate('products');
    res.json(bakers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bakers' });
  }
});

// Create new baker (admin or manufacturer only)
router.post('/', auth, async (req, res) => {
  try {
    // Ensure user is authorized
    if (req.user.role !== 'admin' && req.user.role !== 'manufacturer') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const baker = new Baker(req.body);
    await baker.save();
    res.status(201).json(baker);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create baker' });
  }
});

// Get baker by ID
router.get('/:id', async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.id).populate('products');
    if (!baker) return res.status(404).json({ error: 'Baker not found' });
    res.json(baker);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch baker' });
  }
});

// Add product to baker
router.post('/:bakerId/products', auth, async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.bakerId);
    if (!baker) return res.status(404).json({ error: 'Baker not found' });

    // Only the baker or admin can add products
    if (baker._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const product = new Product({ ...req.body, baker: baker._id });
    await product.save();

    baker.products.push(product._id);
    await baker.save();

    res.json(baker);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add product' });
  }
});

// Remove product from baker
router.delete('/:bakerId/products/:productId', auth, async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.bakerId);
    if (!baker) return res.status(404).json({ error: 'Baker not found' });

    // Only the baker or admin can remove products
    if (baker._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    baker.products = baker.products.filter(prodId => prodId.toString() !== req.params.productId);
    await baker.save();

    await Product.findByIdAndDelete(req.params.productId);
    res.json(baker);
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove product' });
  }
});

module.exports = router;
