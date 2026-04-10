const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { sendNewOrderNotification, sendOrderConfirmation } = require('../emailService');

// @route  POST api/orders
// @access Public
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Send email notifications
    await sendNewOrderNotification(order);
    await sendOrderConfirmation(order);

    res.json({
      success: true,
      message: 'Order placed successfully! Check your email for confirmation.',
      order
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route  GET api/orders
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  GET api/orders/stats/summary
// @access Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const orders = await Order.find();
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    };
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  GET api/orders/:id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  PUT api/orders/:id
// @access Private
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order updated successfully', order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  DELETE api/orders/:id
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;