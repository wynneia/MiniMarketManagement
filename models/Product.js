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

ProductSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { key: 'productID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

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
