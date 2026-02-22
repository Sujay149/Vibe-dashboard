require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../db/connect');
const Item = require('../models/Item');

const items = [
  { id: 1,  name: 'Wireless Headphones',    category: 'Electronics', price: 2999,  description: 'Premium sound with active noise cancellation.' },
  { id: 2,  name: 'Mechanical Keyboard',    category: 'Electronics', price: 4599,  description: 'Tactile feedback with RGB backlighting.' },
  { id: 3,  name: 'Ergonomic Chair',        category: 'Furniture',   price: 12999, description: 'Lumbar support for long work sessions.' },
  { id: 4,  name: 'Standing Desk',          category: 'Furniture',   price: 18999, description: 'Adjustable height for sit-stand workflow.' },
  { id: 5,  name: '4K Monitor',             category: 'Electronics', price: 34999, description: 'Ultra-sharp display with HDR support.' },
  { id: 6,  name: 'Laptop Sleeve',          category: 'Accessories', price: 799,   description: 'Slim protective case for 15-inch laptops.' },
  { id: 7,  name: 'USB-C Hub',              category: 'Accessories', price: 1999,  description: '7-in-1 hub with HDMI, USB-A, and SD card.' },
  { id: 8,  name: 'Running Shoes',          category: 'Sportswear',  price: 5499,  description: 'Lightweight cushioned soles for daily runs.' },
  { id: 9,  name: 'Yoga Mat',              category: 'Sportswear',  price: 899,   description: 'Non-slip surface with alignment guides.' },
  { id: 10, name: 'Coffee Maker',           category: 'Kitchen',     price: 3499,  description: 'Programmable drip coffee with thermal carafe.' },
  { id: 11, name: 'Air Purifier',           category: 'Home',        price: 7999,  description: 'HEPA filter for allergen-free indoor air.' },
  { id: 12, name: 'Smart Watch',            category: 'Electronics', price: 9999,  description: 'Health tracking with GPS and AMOLED display.' },
  { id: 13, name: 'Noise Isolating Earbuds',category: 'Electronics', price: 1499,  description: 'Compact earbuds with deep bass response.' },
  { id: 14, name: 'Desk Lamp',              category: 'Furniture',   price: 1299,  description: 'Adjustable LED with touch dimmer control.' },
  { id: 15, name: 'Water Bottle',           category: 'Accessories', price: 599,   description: 'Insulated stainless steel, keeps cold 24 hrs.' },
  { id: 16, name: 'Backpack',              category: 'Accessories', price: 2499,  description: 'Anti-theft design with USB charging port.' },
  { id: 17, name: 'Blender',              category: 'Kitchen',     price: 2799,  description: 'High-speed blending for smoothies and soups.' },
  { id: 18, name: 'Resistance Bands',       category: 'Sportswear',  price: 499,   description: 'Set of 5 bands with varying resistance levels.' },
  { id: 19, name: 'Webcam HD',              category: 'Electronics', price: 3299,  description: '1080p autofocus webcam with built-in mic.' },
  { id: 20, name: 'Scented Candles Set',    category: 'Home',        price: 649,   description: 'Aromatherapy collection of 6 natural wax candles.' },
];

(async () => {
  await connectDB();

  try {
    await Item.deleteMany({});
    console.log('[Seed] Cleared existing items.');

    const inserted = await Item.insertMany(items);
    console.log(`[Seed] Inserted ${inserted.length} items successfully.`);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
    process.exit(0);
  }
})();
