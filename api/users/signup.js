const { connectToDatabase, parseBody, User, sendJson, sendError, hashPassword } = require('../../lib/db');

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
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'User already exists');
    }

    const hashedPassword = hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    sendJson(res, 201, { 
      message: 'User created', 
      user: { id: newUser._id, name, email },
      token: 'fake-jwt-token'
    });
  } catch (error) {
    console.error('Signup error:', error);
    sendError(res, 500, 'Internal server error');
  }
};
