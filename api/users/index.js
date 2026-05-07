const { loadDb, sendJson } = require('../../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end('Method not allowed');
  }

  const db = await loadDb();
  sendJson(res, 200, db.users);
};
