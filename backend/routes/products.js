const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Fetch product detail error:', error.message);
    return res.status(500).json({ message: 'Invalid product ID or server error' });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, description, price, image, stock } = req.body;

  try {
    if (!name || !description || price === undefined || !image || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all product fields' });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      stock
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, description, price, image, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.image = image || product.image;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update product error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Product removed' });
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete product error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
