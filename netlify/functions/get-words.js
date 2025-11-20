// ใช้ require แทน import
const { Client } = require("pg");

exports.handler = async function (event, context) {

    const client = new Client({
        connectionString: process.env.NEON_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const result = await client.query(`
      SELECT 
        w.id,
        w.word,
        w.meaning,
        w.example,
        w.source,
        t.name AS type
      FROM Words w
      LEFT JOIN WordType t ON w.type_id = t.id
      ORDER BY w.id DESC;
    `);

        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };

    } catch (error) {
        console.error("DB Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database Error" })
        };
    }
};
