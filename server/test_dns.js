const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

const uri = 'mongodb+srv://mahalakshmi:lakshmi123@hackathon.nen5kej.mongodb.net/ecommerce?appName=Hackathon';

async function run() {
  try {
    console.log('Attempting to connect with Google DNS...');
    await mongoose.connect(uri);
    console.log('✅ Connection successful!');
    
    // Check if there are any products
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

run();
