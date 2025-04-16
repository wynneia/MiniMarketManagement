// models/Product.js
const mongoose = require('mongoose');
const Counter = require('./Counter');

const ProductSchema = new mongoose.Schema({
  productID: { type: String, unique: true },
  name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number
}, { timestamps: true });

// Pre-save hook to auto increment productID
ProductSchema.pre('save', async function (next) {
  // Only assign productID if it is a new document
  if (this.isNew) {
    try {
      // Find the counter and increment
      const counter = await Counter.findOneAndUpdate(
        { key: 'productID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // You can customize how the productID is formatted here
      // For example, prepend 'PROD-' and pad the number
      this.productID = `ITM-${String(counter.seq).padStart(4, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Product', ProductSchema);
