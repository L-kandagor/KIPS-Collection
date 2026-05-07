const { connectToDatabase, parseBody, User, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const body = await parseBody(req);
    const { email, password } = body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    await connectToDatabase();
    const user = await User.findOne({ email, password });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    sendJson(res, 200, {
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token: 'fake-jwt-token',
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
