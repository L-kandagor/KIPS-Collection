const products = require('../api/products');
const productDetail = require('../api/products/[id]');
const orders = require('../api/orders');
const cart = require('../api/cart/index');
const cartAdd = require('../api/cart/add');
const cartUpdate = require('../api/cart/update/[productId]');
const cartDelete = require('../api/cart/[productId]');
const usersSignup = require('../api/users/signup');
const usersLogin = require('../api/users/login');
const usersList = require('../api/users/index');

/**
 * Minimal router to map Express routes to the existing module-style handlers in api/**
 *
 * Note: these api handlers expect to inspect req.method themselves.
 */
module.exports = function registerApiRoutes(appOrRouter) {
  appOrRouter.get('/products', products);
  appOrRouter.post('/products', products);
  appOrRouter.get('/products/:id', (req, res) => productDetail({ ...req, query: { id: req.params.id } }, res));
  appOrRouter.put('/products/:id', (req, res) => productDetail({ ...req, query: { id: req.params.id } }, res));
  appOrRouter.delete('/products/:id', (req, res) => productDetail({ ...req, query: { id: req.params.id } }, res));

  appOrRouter.get('/orders', orders);
  appOrRouter.post('/orders', orders);

  appOrRouter.get('/cart', cart);
  appOrRouter.post('/cart/add', cartAdd);
  appOrRouter.put('/cart/update/:productId', (req, res) => cartUpdate({ ...req, query: { productId: req.params.productId } }, res));
  appOrRouter.delete('/cart/:productId', (req, res) => cartDelete({ ...req, query: { productId: req.params.productId } }, res));

  appOrRouter.post('/users/signup', usersSignup);
  appOrRouter.post('/users/login', usersLogin);
  appOrRouter.get('/users', usersList);
};

