const { loadDb, writeDb, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return sendError(res, 400, 'Name, email, and password are required');
  }

  const db = await loadDb();
  const existingUser = db.users.find((user) => user.email === email);
  if (existingUser) {
    return sendError(res, 400, 'User already exists');
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
  };

  db.users.push(newUser);
  await writeDb(db);

  sendJson(res, 201, { message: 'User created', user: newUser });
};
