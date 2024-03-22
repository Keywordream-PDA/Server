const {pool} = require("../connect/mariadb");

const getNewsList = async (stockCode) => {
  let conn, rows
  try {
    conn = await pool.getConnection();
    rows = await conn.query(
        `SELECT newsId, title, press, newsDate, imgUrl
            FROM News 
            WHERE stockCode = ${stockCode}
            ORDER BY newsDate DESC
            LIMIT 20;`
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
    return rows;
  }
}

module.exports = getNewsList