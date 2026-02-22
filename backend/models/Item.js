const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Text index for efficient search across name, category, description
itemSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
