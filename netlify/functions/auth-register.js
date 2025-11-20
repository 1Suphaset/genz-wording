const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db-client');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'name, email and password required' }) };
    }

    // check if user exists
    const exists = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rowCount > 0) {
      return { statusCode: 409, body: JSON.stringify({ ok: false, error: 'email already registered' }) };
    }

    const hash = await bcrypt.hash(password, 10);
    const res = await db.query(
      'INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id, name, email, created_at',
      [name, email, hash]
    );

    const user = res.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, token, user })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
