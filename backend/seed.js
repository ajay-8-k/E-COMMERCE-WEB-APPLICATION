const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

// Load env config
dotenv.config();

const sampleProducts = [
  {
    name: 'Pro Wireless Headphones',
    description: 'High-fidelity audio with active noise cancellation, built-in voice control, and up to 30 hours of rechargeable battery life. Premium leather ear cups for maximum comfort.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 15
  },
  {
    name: 'Minimalist Smartwatch',
    description: 'A stylish hybrid smartwatch featuring heart rate monitoring, sleep tracking, step counting, and smart notifications. Waterproof up to 50 meters with a sleek leather band.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 10
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Ultra-responsive mechanical keyboard with customizable RGB backlighting, tactile blue switches, and premium aluminum frame. Perfect for gaming and daily office typing.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    stock: 25
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Ergonomic mesh office chair with adjustable lumbar support, 3D armrests, and dynamic tilt-lock mechanism. Designed to keep you comfortable during long working hours.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80',
    stock: 8
  },
  {
    name: 'Ultra-Thin 4K Monitor',
    description: 'Stunning 27-inch 4K IPS display with borderless bezel, sRGB 99% color accuracy, and multiple connectivity ports. Ideal for content creators and programmers.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    stock: 12
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact wireless speaker delivering powerful 360-degree stereo sound. IP67 waterproof and dustproof with up to 12 hours of playtime. Take your music anywhere.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    stock: 30
  }
];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-project';
    console.log(`Connecting to database at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB database for seeding.');

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data.');

    // Hash passwords for seed users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    // Save Admin User
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    // We hashed password beforehand, save bypass schema pre-save hooks
    await adminUser.save({ validateBeforeSave: false });

    // Save Normal User
    const normalUser = new User({
      name: 'Jane Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    await normalUser.save({ validateBeforeSave: false });

    console.log('Seeded Users:');
    console.log('- User: user@example.com / user123');
    console.log('- Admin: admin@example.com / admin123');

    // Seed products
    const seededProducts = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${seededProducts.length} products.`);

    // Pre-create cart for normal user
    await Cart.create({
      userId: normalUser._id,
      products: []
    });
    console.log('Seeded user shopping cart initialization.');

    console.log('Database seeding successfully finished.');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding operation failed:', error.message);
    process.exit(1);
  }
};

seedDB();
