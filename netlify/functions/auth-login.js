const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db-client');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'email and password required' }) };
    }

    const res = await db.query('SELECT id, name, email, password_hash FROM users WHERE email=$1', [email]);
    if (res.rowCount === 0) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'invalid credentials' }) };
    }

    const user = res.rows[0];
    const match = await bcrypt.compare(password, user.password_hash || '');
    if (!match) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'invalid credentials' }) };
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    // don't return password_hash
    delete user.password_hash;

    return { statusCode: 200, body: JSON.stringify({ ok: true, token, user }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
