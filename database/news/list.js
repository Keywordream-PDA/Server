const {pool} = require("../connect/mariadb");

const getNewsList = async (stockCode) => {
  let conn, rows
  try {
    conn = await pool.getConnection();
    const newsIds = await conn.query(`
      SELECT newsIds
      FROM NewsStock
      WHERE stockCode = ${stockCode}
    `)
    rows = await conn.query(
        `SELECT newsId, title, press, newsDate, imgUrl
            FROM News 
            WHERE newsId in (${newsIds[0]["newsIds"].join(", ")})
            ORDER BY newsDate DESC
        ;`
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
    return rows;
  }
}

const getKeywordNewsList = async (stockCode) => {
  let conn, rows
  try {
    conn = await pool.getConnection();
    const newsIds = await conn.query(`
      SELECT newsIds
      FROM NewsStock
      WHERE stockCode = ${stockCode}
    `)
    rows = await conn.query(
        `SELECT newsId, title, press, newsDate, imgUrl, content
            FROM News 
            WHERE newsId in (${newsIds[0]["newsIds"].join(", ")})
            ORDER BY newsDate DESC
        ;`
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
    // console.log(rows);
    return rows;
  }
}

module.exports = {
  getNewsList : getNewsList,
  getKeywordNewsList : getKeywordNewsList,
}