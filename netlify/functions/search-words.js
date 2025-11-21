// netlify/functions/search-words.js
const { Client } = require("pg");

exports.handler = async function (event, context) {
    const client = new Client({
        connectionString: process.env.NEON_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // อ่าน query params: ?q=คำค้น&categories=คำนาม,กริยา
        const { q, categories } = event.queryStringParameters || {};

        // เตรียม SQL
        let baseQuery = `
      SELECT w.id, w.word, w.meaning, w.example, w.source, t.name AS category
      FROM Words w
      LEFT JOIN WordType t ON w.type_id = t.id
    `;
        let conditions = [];
        let values = [];

        // Search term
        if (q) {
            values.push(`%${q}%`);
            values.push(`%${q}%`);
            conditions.push(`(w.word ILIKE $${values.length - 1} OR w.meaning ILIKE $${values.length})`);
        }

        // Filter categories
        if (categories) {
            const cats = categories.split(",");
            const catPlaceholders = cats.map((_, i) => `$${values.length + i + 1}`).join(",");
            values.push(...cats);
            conditions.push(`t.name IN (${catPlaceholders})`);
        }

        if (conditions.length > 0) {
            baseQuery += " WHERE " + conditions.join(" AND ");
        }

        baseQuery += " ORDER BY w.id DESC;";

        const result = await client.query(baseQuery, values);
        await client.end();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(result.rows),
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: "Database Error" }),
        };
    }
};
