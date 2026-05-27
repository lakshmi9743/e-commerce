const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const updates = [
  { name: 'Wireless Noise-Cancelling Headphones', price: 24999 },
  { name: 'Smart Fitness Watch',                  price: 19999 },
  { name: 'Premium Leather Jacket',               price: 14999 },
  { name: 'Mechanical Gaming Keyboard',           price: 9999 },
  { name: 'Yoga Mat Pro',                         price: 3999 },
  { name: 'Portable Bluetooth Speaker',           price: 5999 },
  { name: 'The Art of Clean Code',                price: 2499 },
  { name: 'Ceramic Coffee Mug Set',               price: 2999 },
  { name: 'Running Shoes Ultra',                  price: 12999 },
  { name: 'Vitamin C Serum',                      price: 2499, image: '/vitamin_c_serum.png' },
  { name: '4K Webcam Pro',                        price: 6999 },
  { name: 'Lego Architecture Set',                price: 6999 },
];

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mahalakshmi:lakshmi123@hackathon.nen5kej.mongodb.net/ecommerce?appName=Hackathon';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connection successful!');

    console.log('Updating product prices and images...');
    for (const update of updates) {
      const fieldsToSet = { price: update.price };
      if (update.image) {
        fieldsToSet.image = update.image;
      }
      
      const result = await Product.updateOne(
        { name: update.name },
        { $set: fieldsToSet }
      );
      
      console.log(`${result.modifiedCount ? '✅' : '⚠️ '} Updated: "${update.name}" to price: ₹${update.price}`);
    }

    console.log('\n🎉 Product updates successfully completed!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection or update failed:', err);
    process.exit(1);
  }
}

run();
