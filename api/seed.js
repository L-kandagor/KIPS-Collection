const { connectToDatabase, Product } = require('../lib/db');

module.exports = async (req, res) => {
  await connectToDatabase();
  
  const products = [
    { name: "Nairobi Street Shirt", price: 1850, originalPrice: 2400, discount: 23, category: "men", image: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=800&h=800&fit=crop", description: "A bold shirt with a clean cut for everyday Nairobi style." },
    // Add all your products here from database.json
  ];
  
  for (const p of products) {
    const existing = await Product.findOne({ name: p.name });
    if (!existing) {
      await new Product(p).save();
    }
  }
  
  res.json({ message: 'Seeded' });
};