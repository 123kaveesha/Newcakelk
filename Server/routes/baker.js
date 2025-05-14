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
    res.status(500).json({ error: err.message });
  }
});

// Create new baker (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin or manufacturer
    if (req.user.role !== 'admin' && req.user.role !== 'manufacturer') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const baker = new Baker(req.body);
    await baker.save();
    res.status(201).json(baker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get baker by ID
router.get('/:id', async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.id).populate('products');
    if (!baker) return res.status(404).json({ error: 'Baker not found' });
    res.json(baker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to baker
router.post('/:bakerId/products', auth, async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.bakerId);
    if (!baker) return res.status(404).json({ error: 'Baker not found' });

    // Check if the logged in user is the baker or admin
    if (baker._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const product = new Product({
      ...req.body,
      baker: baker._id
    });
    await product.save();

    baker.products.push(product._id);
    await baker.save();

    res.json(baker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove product from baker
router.delete('/:bakerId/products/:productId', auth, async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.bakerId);
    if (!baker) return res.status(404).json({ error: 'Baker not found' });

    // Check if the logged in user is the baker or admin
    if (baker._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.remove();

    // Remove product reference from baker
    baker.products = baker.products.filter(
      prodId => prodId.toString() !== req.params.productId
    );
    await baker.save();

    res.json(baker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;