const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

const uri = 'mongodb+srv://mahalakshmi:lakshmi123@hackathon.nen5kej.mongodb.net/ecommerce?appName=Hackathon';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connection successful!');
    
    const Product = require('./models/Product');
    const productsCount = await Product.countDocuments();
    console.log('Total products in DB:', productsCount);
    
    if (productsCount > 0) {
      const sample = await Product.findOne();
      console.log('Sample product:', sample.name);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

run();
