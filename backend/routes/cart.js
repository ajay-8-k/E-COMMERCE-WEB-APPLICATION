const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get logged-in user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    }
    
    return res.json(cart);
  } catch (error) {
    console.error('Fetch cart error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/add
// @desc    Add product to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = quantity ? parseInt(quantity) : 1;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        products: [{ productId, quantity: qty }]
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += qty;
      } else {
        cart.products.push({ productId, quantity: qty });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    return res.json(populatedCart);
  } catch (error) {
    console.error('Add cart item error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cart/update
// @desc    Update quantity of product in cart
// @access  Private
router.put('/update', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity);

  if (!productId || quantity === undefined) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  if (qty < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const itemIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity = qty;
        await cart.save();
        const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
        return res.json(populatedCart);
      } else {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Update cart quantity error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/remove
// @desc    Remove product from cart
// @access  Private
// Supports productId from both body and query for frontend convenience
router.delete('/remove', protect, async (req, res) => {
  const productId = req.body.productId || req.query.productId;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId
      );
      
      await cart.save();
      const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
      return res.json(populatedCart);
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Remove cart item error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
