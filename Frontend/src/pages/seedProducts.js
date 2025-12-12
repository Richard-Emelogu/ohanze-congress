const fs = require('fs');
const path = require('path');

// August 93 Club Products
const products = [
  // POLO SHIRTS
  {
    id: Date.now().toString() + '1',
    name: 'August 93 Premium Polo - Maroon',
    description: 'Premium quality cotton polo shirt with embroidered August 93 Club logo. Perfect for members and events. Comfortable fit with breathable fabric.',
    price: 18000,
    category: 'polo',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: 'https://m.media-amazon.com/images/I/71VqHC3d5vL._AC_UY1000_.jpg',
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '2',
    name: 'August 93 Classic Polo - Red',
    description: 'Classic red polo with "Service for Advancement" motto. High-quality stitching and durable fabric. Official Ohanze Congress merchandise.',
    price: 17000,
    category: 'polo',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: 'https://m.media-amazon.com/images/I/71vYO5xqlOL._AC_UY1000_.jpg',
    stock: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '3',
    name: 'August 93 Executive Polo - Crimson',
    description: 'Executive edition crimson polo for official events. Premium cotton blend with gold-threaded August 93 emblem. Limited edition.',
    price: 22000,
    category: 'polo',
    sizes: ['M', 'L', 'XL', 'XXL'],
    imageUrl: 'https://m.media-amazon.com/images/I/71D+FcKGYbL._AC_UY1000_.jpg',
    stock: 30,
    createdAt: new Date().toISOString()
  },

  // CAPS
  {
    id: Date.now().toString() + '4',
    name: 'August 93 Baseball Cap - Black',
    description: 'Classic black baseball cap with embroidered August 93 Club logo. Adjustable strap for perfect fit. Premium cotton material.',
    price: 8500,
    category: 'cap',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/61YGUXJt5KL._AC_UY1000_.jpg',
    stock: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '5',
    name: 'Ohanze Congress Snapback - Maroon',
    description: 'Premium maroon snapback with Ohanze Congress branding. Flat brim design with gold accents. Street style meets elegance.',
    price: 9500,
    category: 'cap',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/81PF7GuSe9L._AC_UY1000_.jpg',
    stock: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '6',
    name: 'August 93 Dad Hat - Red',
    description: 'Comfortable dad hat style with curved brim. August 93 Club embroidery in gold thread. Perfect for casual wear.',
    price: 7500,
    category: 'cap',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/71r9oxBFOxL._AC_UY1000_.jpg',
    stock: 90,
    createdAt: new Date().toISOString()
  },

  // BANGLES
  {
    id: Date.now().toString() + '7',
    name: 'Ohanze Unity Leather Bangle - Brown',
    description: 'Handcrafted genuine leather bangle with Ohanze Congress emblem. Symbol of unity and brotherhood. Adjustable closure.',
    price: 5500,
    category: 'bangle',
    sizes: ['S', 'M', 'L'],
    imageUrl: 'https://m.media-amazon.com/images/I/71KXLj8PjbL._AC_UY1000_.jpg',
    stock: 75,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '8',
    name: 'August 93 Beaded Bangle - Multi-color',
    description: 'Traditional beaded bangle in August 93 Club colors. Handmade by local artisans. Each piece is unique.',
    price: 4500,
    category: 'bangle',
    sizes: ['S', 'M', 'L'],
    imageUrl: 'https://m.media-amazon.com/images/I/81zKGq0WgBL._AC_UY1000_.jpg',
    stock: 60,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '9',
    name: 'Congress Elite Bangle - Gold Accent',
    description: 'Premium leather bangle with gold-plated August 93 emblem. Executive edition for distinguished members.',
    price: 8000,
    category: 'bangle',
    sizes: ['M', 'L'],
    imageUrl: 'https://m.media-amazon.com/images/I/71nEVHW1WyL._AC_UY1000_.jpg',
    stock: 40,
    createdAt: new Date().toISOString()
  },

  // ACCESSORIES
  {
    id: Date.now().toString() + '10',
    name: 'August 93 Metal Keychain',
    description: 'Durable zinc alloy keychain with August 93 Club logo. Premium quality with gold finish. Perfect gift item.',
    price: 2500,
    category: 'accessory',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/71YTwMvmfyL._AC_UY1000_.jpg',
    stock: 200,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '11',
    name: 'Ohanze Congress Wristband',
    description: 'Silicone wristband with raised August 93 branding. Comfortable and durable. Available in multiple colors.',
    price: 1500,
    category: 'accessory',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/71YB9YbQKyL._AC_UY1000_.jpg',
    stock: 250,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '12',
    name: 'August 93 Enamel Pin Set',
    description: 'Collectible enamel pin set featuring August 93 Club emblems. Set of 3 pins with butterfly clutch backs.',
    price: 3500,
    category: 'accessory',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/81oRgKLMZmL._AC_UY1000_.jpg',
    stock: 150,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '13',
    name: 'Congress Member Tote Bag',
    description: 'Heavy-duty canvas tote bag with August 93 Club print. Large capacity for everyday use. Eco-friendly and stylish.',
    price: 6500,
    category: 'accessory',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/81P3JZ7F1LL._AC_UY1000_.jpg',
    stock: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: Date.now().toString() + '14',
    name: 'August 93 Coffee Mug - Ceramic',
    description: 'Premium ceramic mug with August 93 Club design. Microwave and dishwasher safe. 12oz capacity.',
    price: 4000,
    category: 'accessory',
    sizes: ['One Size'],
    imageUrl: 'https://m.media-amazon.com/images/I/61J8r3ejHZL._AC_UY1000_.jpg',
    stock: 120,
    createdAt: new Date().toISOString()
  }
];

// Seed the database
function seedProducts() {
  const dbPath = path.join(__dirname, 'database.json');
  
  try {
    // Read existing database
    let db;
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
    } else {
      db = { users: [], orders: [], products: [] };
    }

    // Add products
    db.products = products;

    // Write to database
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    console.log('✅ Successfully added August 93 Club products!');
    console.log(`📦 Total products: ${products.length}`);
    console.log('');
    console.log('Products by category:');
    console.log(`  👕 Polo Shirts: ${products.filter(p => p.category === 'polo').length}`);
    console.log(`  🧢 Caps: ${products.filter(p => p.category === 'cap').length}`);
    console.log(`  📿 Bangles: ${products.filter(p => p.category === 'bangle').length}`);
    console.log(`  🎁 Accessories: ${products.filter(p => p.category === 'accessory').length}`);
    console.log('');
    console.log('🚀 You can now view these products at: http://localhost:3000/store');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
}

// Run the seeder
seedProducts();

module.exports = { products };