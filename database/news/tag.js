const {pool} = require("../connect/mariadb");

const getTagTop3 = async (stockCode) => {
  let conn, tagTop3
  try {
    conn = await pool.getConnection();
    let tags = await conn.query(`SELECT data FROM Keyword WHERE stockCode = ${stockCode};`);
    tags = tags[0].data
    tagTop3 = [tags[0].word, tags[1].word, tags[2].word]
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
    return tagTop3;
  }
}

module.exports = getTagTop3