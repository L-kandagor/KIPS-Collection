const express = require('express');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const router = express.Router();

// Helper to read/write database
const readDb = (dbPath) => JSON.parse(readFileSync(dbPath, 'utf8'));
const writeDb = (dbPath, data) => writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = (db) => {
  const dbPath = require('path').join(__dirname, 'database.json');

  // Products routes
  router.get('/products', (req, res) => {
    const { category, search } = req.query;
    let products = db.data.products;

    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(products);
  });

  router.get('/products/:id', (req, res) => {
    const product = db.data.products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  router.post('/products', (req, res) => {
    const newProduct = { id: Date.now(), ...req.body };
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
    res.status(204).send();
  });

  // Users routes
  router.post('/users/signup', (req, res) => {
    const { email, password, name } = req.body;
    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = { id: Date.now(), email, password, name };
    db.data.users.push(newUser);
    db.write();
    res.status(201).json({ message: 'User created', user: newUser });
  });

  router.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.data.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user, token: 'fake-jwt-token' });
  });

  router.get('/users', (req, res) => {
    res.json(db.data.users);
  });

  // Cart routes
  router.get('/cart', (req, res) => {
    res.json(db.data.cart);
  });

  router.post('/cart/add', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const existingItem = db.data.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      db.data.cart.push({ productId, quantity });
    }
    db.write();
    res.json({ message: 'Added to cart' });
  });

  router.put('/cart/update/:productId', (req, res) => {
    const { quantity } = req.body;
    const index = db.data.cart.findIndex(item => item.productId === parseInt(req.params.productId));
    if (index !== -1) {
      if (quantity <= 0) {
        db.data.cart.splice(index, 1);
      } else {
        db.data.cart[index].quantity = quantity;
      }
      db.write();
    }
    res.json({ message: 'Cart updated' });
  });

  router.delete('/cart/:productId', (req, res) => {
    db.data.cart = db.data.cart.filter(item => item.productId !== parseInt(req.params.productId));
    db.write();
    res.status(204).send();
  });

  // Orders routes
  router.post('/orders', (req, res) => {
    const order = {
      id: Date.now(),
      items: db.data.cart,
      total: req.body.total,
      timestamp: new Date().toISOString()
    };
    db.data.orders.push(order);
    db.data.cart = [];
    db.write();
    res.status(201).json(order);
  });

  router.get('/orders', (req, res) => {
    res.json(db.data.orders);
  });

  return router;
};