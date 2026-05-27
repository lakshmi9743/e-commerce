const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio certification.', price: 24999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', stock: 45, rating: 4.8, numReviews: 124, featured: true, brand: 'SoundMax' },
  { name: 'Smart Fitness Watch', description: 'Advanced health tracking with GPS, heart rate monitor, sleep tracking, and 7-day battery. Water-resistant to 50m.', price: 19999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', stock: 30, rating: 4.6, numReviews: 89, featured: true, brand: 'FitTech' },
  { name: 'Premium Leather Jacket', description: 'Genuine leather biker jacket with quilted lining, multiple pockets, and YKK zippers. Classic style meets modern fit.', price: 14999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', stock: 20, rating: 4.7, numReviews: 56, featured: true, brand: 'UrbanEdge' },
  { name: 'Mechanical Gaming Keyboard', description: 'TKL mechanical keyboard with Cherry MX switches, RGB backlit, N-key rollover, and aircraft-grade aluminum frame.', price: 9999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', stock: 60, rating: 4.9, numReviews: 210, featured: true, brand: 'GameForce' },
  { name: 'Yoga Mat Pro', description: 'Extra thick 6mm eco-friendly TPE yoga mat with alignment lines, non-slip surface, and carrying strap included.', price: 3999, category: 'Sports', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', stock: 100, rating: 4.5, numReviews: 78, featured: false, brand: 'ZenFit' },
  { name: 'Portable Bluetooth Speaker', description: '360° surround sound speaker with 24-hour battery, IPX7 waterproof rating, and built-in microphone for calls.', price: 5999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', stock: 55, rating: 4.4, numReviews: 162, featured: true, brand: 'SoundMax' },
  { name: 'The Art of Clean Code', description: 'A comprehensive guide to writing maintainable, efficient, and elegant code. Packed with real-world examples and best practices.', price: 2499, category: 'Books', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80', stock: 200, rating: 4.8, numReviews: 345, featured: false, brand: 'TechPress' },
  { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 hand-crafted ceramic mugs with speckled glaze finish. Microwave and dishwasher safe. 12oz capacity each.', price: 2999, category: 'Home & Garden', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', stock: 80, rating: 4.6, numReviews: 93, featured: false, brand: 'CraftHome' },
  { name: 'Running Shoes Ultra', description: 'Lightweight carbon-fiber plate running shoes with energy-return foam midsole. Designed for marathon performance.', price: 12999, category: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', stock: 35, rating: 4.7, numReviews: 188, featured: true, brand: 'SpeedRun' },
  { name: 'Vitamin C Serum', description: 'Professional-grade 20% Vitamin C + Hyaluronic Acid serum for brightening, anti-aging, and deep hydration.', price: 2499, category: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', stock: 120, rating: 4.5, numReviews: 267, featured: false, brand: 'GlowLab' },
  { name: '4K Webcam Pro', description: 'Ultra HD webcam with AI auto-framing, built-in ring light, noise-cancelling mic, and privacy shutter.', price: 6999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80', stock: 40, rating: 4.3, numReviews: 71, featured: false, brand: 'VisionTech' },
  { name: 'Lego Architecture Set', description: 'Build iconic landmarks with this premium 1,500 piece architecture set. Suitable for ages 16+. Includes instruction booklet.', price: 6999, category: 'Toys', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80', stock: 25, rating: 4.9, numReviews: 134, featured: true, brand: 'BrickWorld' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create sample user
    await User.create({
      name: 'John Doe',
      email: 'user@store.com',
      password: 'user123',
      role: 'user',
    });

    // Seed products
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log('Admin: admin@store.com / admin123');
    console.log('User:  user@store.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
