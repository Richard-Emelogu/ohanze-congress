const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
// const { sendNewOrderNotification, sendOrderConfirmation } = require('../emailService');

// @route   POST api/orders
// @desc    Create a new order (with email notifications!)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const order = newOrder.save();

    // 🔔 SEND EMAIL NOTIFICATIONS
    console.log('📧 Sending email notifications...');
    
    // Send email to admin
    await sendNewOrderNotification(order);
    
    // Send confirmation email to customer
    await sendOrderConfirmation(order);

    res.json({
      success: true,
      message: 'Order placed successfully! Check your email for confirmation.',
      order
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET api/orders
// @desc    Get all orders (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/orders/:id
// @desc    Update order status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const order = Order.updateById(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/orders/:id
// @desc    Delete an order
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    Order.deleteById(req.params.id);
    res.json({ 
      success: true,
      message: 'Order deleted successfully' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/stats/summary
// @desc    Get sales statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = Order.getStats();
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;