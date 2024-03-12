require("dotenv").config();
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function GetDataList() {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    // console.log(conn);
    rows = await conn.query("SELECT * from test;");
    // console.log(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
    return rows;
  }
}

module.exports = {
  GetDataList: GetDataList,
};
