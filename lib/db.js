const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kips-collection';

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  image: String,
  description: String,
});

const cartItemSchema = new mongoose.Schema({
  productId: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  items: [cartItemSchema],
  total: Number,
  timestamp: Date,
});

// Models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

module.exports = {
  connectToDatabase,
  User,
  Product,
  CartItem,
  Order,
  sendJson,
  sendError,
};
