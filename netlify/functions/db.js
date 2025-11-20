const { Pool } = require('pg');

// Reuse pool across invocations to avoid exhausting connections
let pool;
function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.NEON_DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    return pool;
}

exports.handler = async (event) => {
    const pool = getPool();
    try {
        const res = await pool.query('SELECT NOW() as now');
        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, now: res.rows[0].now })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: err.message })
        };
    }
};
