const { connectToDatabase, Product } = require('./lib/db');
const fs = require('fs');
const path = require('path');

async function seed() {
  await connectToDatabase();

  const dbPath = path.join(__dirname, 'server', 'database.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  for (const product of data.products) {
    const existing = await Product.findOne({ name: product.name });
    if (!existing) {
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`Seeded product: ${product.name}`);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(console.error);
