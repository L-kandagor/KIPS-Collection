const express = require('express');
const crypto = require('crypto');

function createRoutes(db) {
  const router = express.Router();

  // Simple hash for passwords (use bcrypt in production)
  function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Simple token generation
  function generateToken(user) {
    return Buffer.from(JSON.stringify({ id: user.id, email: user.email, ts: Date.now() })).toString('base64');
  }

  // ─── PRODUCTS ────────────────────────────────────────────────────────────────

  router.get('/products', (req, res) => {
    res.json(db.data.products);
  });

  router.get('/products/:id', (req, res) => {
    const product = db.data.products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  router.post('/products', (req, res) => {
    const newProduct = {
      id: Date.now(),
      ...req.body
    };
    db.data.products.push(newProduct);
    db.write();
    res.status(201).json(newProduct);
  });

  router.put('/products/:id', (req, res) => {
    const index = db.data.products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    db.data.products[index] = { ...db.data.products[index], ...req.body };
    db.write();
    res.json(db.data.products[index]);
  });

  router.delete('/products/:id', (req, res) => {
    const index = db.data.products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    db.data.products.splice(index, 1);
    db.write();
    res.json({ success: true });
  });

  // ─── USERS / AUTH ─────────────────────────────────────────────────────────────

  router.post('/users/signup', (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const existingUser = db.data.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString()
      };

      db.data.users.push(newUser);
      db.write();

      const { password: _, ...safeUser } = newUser;
      res.status(201).json({ user: safeUser, token: generateToken(safeUser) });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Signup failed. Please try again.' });
    }
  });

  router.post('/users/login', (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = db.data.users.find(u => u.email === email);
      if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser, token: generateToken(safeUser) });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  });

  router.get('/users', (req, res) => {
    const safeUsers = db.data.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  // ─── ORDERS ──────────────────────────────────────────────────────────────────

  router.get('/orders', (req, res) => {
    res.json(db.data.orders);
  });

  router.post('/orders', (req, res) => {
    const newOrder = {
      id: Date.now(),
      ...req.body,
      timestamp: new Date().toISOString()
    };
    db.data.orders.push(newOrder);
    db.write();
    res.status(201).json(newOrder);
  });

  // ─── CART ────────────────────────────────────────────────────────────────────

  router.get('/cart', (req, res) => {
    res.json(db.data.cart);
  });

  router.post('/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const existing = db.data.cart.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      db.data.cart.push({ productId, quantity: quantity || 1 });
    }
    db.write();
    res.json(db.data.cart);
  });

  router.delete('/cart/:productId', (req, res) => {
    db.data.cart = db.data.cart.filter(i => i.productId !== parseInt(req.params.productId));
    db.write();
    res.json(db.data.cart);
  });

  return router;
}

module.exports = createRoutes;