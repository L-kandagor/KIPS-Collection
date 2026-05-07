const { connectToDatabase, User, sendJson, sendError } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return sendError(res, 400, 'Name, email, and password are required');
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User already exists');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    sendJson(res, 201, { message: 'User created', user: { id: newUser._id, name, email } });
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
};
