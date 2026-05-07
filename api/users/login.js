const { loadDb, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  const db = await loadDb();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return sendError(res, 401, 'Invalid credentials');
  }

  sendJson(res, 200, {
    message: 'Login successful',
    user,
    token: 'fake-jwt-token',
  });
};
