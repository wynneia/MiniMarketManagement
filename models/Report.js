const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reportType: { type: String, enum: ['Weekly', 'Monthly', 'Custom'], required: true },
  soldItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    soldCount: Number,
    revenue: Number
  }],
  totalRevenue: Number,
  reportDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
