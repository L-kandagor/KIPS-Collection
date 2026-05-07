const { connectToDatabase, Product } = require('../lib/db');

module.exports = async (req, res) => {
  await connectToDatabase();
  
  const products = [
    { name: "Nairobi Street Shirt", price: 1850, originalPrice: 2400, discount: 23, category: "men", image: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=800&h=800&fit=crop", description: "A bold shirt with a clean cut for everyday Nairobi style." },
    { name: "Mombasa Midi Dress", price: 3200, originalPrice: 4200, discount: 24, category: "women", image: "https://images.unsplash.com/photo-1520975915824-445fca094479?w=800&h=800&fit=crop", description: "Lightweight midi dress with flowy fabric perfect for warm evenings." },
    { name: "Safari Travel Backpack", price: 2800, originalPrice: 3350, discount: 16, category: "bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop", description: "Durable travel backpack with smart storage for city or safari days." },
    { name: "Nairobi Runner Sneakers", price: 4200, originalPrice: 5200, discount: 19, category: "shoes", image: "https://images.unsplash.com/photo-1519741494781-8d7d5a2487c2?w=800&h=800&fit=crop", description: "Comfortable sneakers designed for style and all-day wear." },
    { name: "Gold Accent Necklace", price: 1150, originalPrice: 1500, discount: 23, category: "accessories", image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=800&fit=crop", description: "Statement necklace finished with polished metallic details." }
  ];
  
  for (const p of products) {
    const existing = await Product.findOne({ name: p.name });
    if (!existing) {
      await new Product(p).save();
    }
  }
  
  res.json({ message: 'Seeded' });
};