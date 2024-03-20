const {pool} = require("../connect/mariadb");

const getTags = async (stockCode) => {
  let conn, row
  try {
    conn = await pool.getConnection();
    row = await conn.query(`SELECT data FROM Keyword WHERE stockCode = ${stockCode};`);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
    return row[0].data;
  }
}

module.exports = getTags