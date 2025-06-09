require("dotenv/config");
const {
  Pool
} = require("pg");

const config = {
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.POSTGRES_PORT || '5433',
};

const pool = new Pool(config);

process.on('exit', async () => {
  await pool.end();
});

module.exports = {
  pool
}