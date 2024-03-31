const {pool} = require("../connect/mariadb");

const getNewsDetail = async (newsId) => {
  let conn, row
  try {
    conn = await pool.getConnection();
    row = await conn.query(
        `SELECT title, press, newsDate, isGood, content
            FROM News 
            WHERE newsId = ${newsId};`
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
    return row[0];
  }
}

module.exports = getNewsDetail