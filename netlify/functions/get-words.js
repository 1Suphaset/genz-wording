const { Client } = require("pg");

exports.handler = async function (event, context) {
    const client = new Client({
        connectionString: process.env.NEON_DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();

        const result = await client.query(`
      SELECT w.id, w.word, w.meaning, w.example, w.source, t.name AS type
      FROM Words w
      LEFT JOIN WordType t ON w.type_id = t.id
      ORDER BY w.id DESC;
    `);

        await client.end();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // <<== แก้ CORS
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(result.rows),
        };
    } catch (error) {
        console.error(error);
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
