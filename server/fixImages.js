const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

// Reliable Picsum images (consistent with seed number) + fallback for specific products
const imageUpdates = [
  { name: 'Wireless Noise-Cancelling Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { name: 'Smart Fitness Watch',                  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { name: 'Premium Leather Jacket',               image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
  { name: 'Mechanical Gaming Keyboard',           image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80' },
  { name: 'Yoga Mat Pro',                         image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80' },
  { name: 'Portable Bluetooth Speaker',           image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' },
  { name: 'The Art of Clean Code',                image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80' },
  { name: 'Ceramic Coffee Mug Set',               image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80' },
  { name: 'Running Shoes Ultra',                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { name: 'Vitamin C Serum',                      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80' },
  { name: '4K Webcam Pro',                        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80' },
  { name: 'Lego Architecture Set',                image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80' },
];

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Updating product images...');

  for (const { name, image } of imageUpdates) {
    const result = await Product.updateOne({ name }, { $set: { image } });
    console.log(`${result.modifiedCount ? '✅' : '⚠️ '} ${name}`);
  }

  console.log('\nDone! All images updated.');
  process.exit(0);
}

fixImages().catch(err => { console.error(err); process.exit(1); });
