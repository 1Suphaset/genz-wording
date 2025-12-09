const { Client } = require("pg");

exports.handler = async function (event, context) {
    const client = new Client({
        connectionString: process.env.NEON_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const { q, categories, mode } = event.queryStringParameters || {};

        let baseQuery = `
            SELECT w.id, w.word, w.meaning, w.example, w.source, t.name AS category
            FROM Words w
            LEFT JOIN WordType t ON w.type_id = t.id
        `;

        let conditions = [];
        let values = [];
        let paramIndex = 1;

        // 🔍 Search keyword
        if (q) {
            let pattern;
            const searchMode = (mode || "").trim().toLowerCase();

            if (searchMode === "start") {
                pattern = `${q}%`;
                conditions.push(`unaccent(lower(w.word)) LIKE unaccent(lower($${paramIndex}))`);
                values.push(pattern);
                paramIndex++;
            } else {
                pattern = `%${q}%`;
                conditions.push(`
            unaccent(lower(w.word)) LIKE unaccent(lower($${paramIndex}))
            OR unaccent(lower(w.meaning)) LIKE unaccent(lower($${paramIndex + 1}))
        `);
                values.push(pattern, pattern);
                paramIndex += 2;
            }
        }



        // 🔎 Filter categories
        if (categories) {
            const cats = categories.split(",");
            const placeholders = cats.map(() => `$${paramIndex++}`).join(", ");
            values.push(...cats);
            conditions.push(`t.name IN (${placeholders})`);
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
