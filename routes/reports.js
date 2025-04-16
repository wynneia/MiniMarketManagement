const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Product = require('../models/Product');

// Create new report and update product stocks accordingly
router.post('/', async (req, res) => {
  try {
    const { reportType, soldItems } = req.body;
    let totalRevenue = 0;

    // Loop through each sold item and update product stock
    for (const item of soldItems) {
      const { product: productId, soldCount, revenue } = item;
      totalRevenue += revenue;
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -soldCount } });
    }

    const report = new Report({ reportType, soldItems, totalRevenue });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reports (with populated product info)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().populate('soldItems.product');
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
