const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order (Checkout)
// @access  Private
router.post('/', protect, async (req, res) => {
  const { address } = req.body;

  if (!address || address.trim() === '') {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Verify stock and prepare products list for order
    const orderProducts = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.productId;
      if (!product) {
        return res.status(404).json({ message: 'One of the products in your cart is no longer available' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available stock: ${product.stock}`
        });
      }

      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    // Deduct stock from product inventory
    for (const item of cart.products) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // Create Order
    const order = new Order({
      userId: req.user._id,
      products: orderProducts,
      totalAmount,
      address,
      status: 'Pending'
    });

    const createdOrder = await order.save();

    // Clear cart products
    cart.products = [];
    await cart.save();

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get logged in user orders OR all orders if admin
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
    }
    return res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { status } = req.body;

  if (!status || !['Pending', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status value (must be Pending, Shipped, or Delivered)' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order status error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
