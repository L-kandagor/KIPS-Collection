const { connectToDatabase, User, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  try {
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
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
