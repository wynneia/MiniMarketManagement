const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;
    const product = new Product({ name, description, category, price, stock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:productID', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productID: req.params.productID },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:productID', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productID: req.params.productID });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
