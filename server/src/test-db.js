require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase 필수
});

async function testConnection() {
  try {
    await client.connect();
    const res = await client.query('select now()');
    console.log('✅ DB 연결 성공:', res.rows[0]);
  } catch (err) {
    console.error('❌ DB 연결 실패:', err);
  } finally {
    await client.end();
  }
}

testConnection();
