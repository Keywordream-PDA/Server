require("dotenv").config();
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 3,
});

async function GetDataList() {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    //console.log(conn);
    rows = await conn.query("SELECT * from user;");
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}

async function GetKeyword(stockCode) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    //console.log(conn);
    rows = await conn.query(
      "SELECT data from Keyword WHERE stockCode = ?;",
      stockCode
    );
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}
async function GetsearchAll() {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    //console.log(conn);
    rows = await conn.query("SELECT * from Stock ORDER BY name;");
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}

async function getAllStockCodes() {
  let conn;
  try {
    conn = await pool.getConnection();
    rows = await conn.query("SELECT stockCode FROM Stock;");
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

async function GetsearchList(query) {
  let conn, rows;
  const stockCode = query.code;
  try {
    conn = await pool.getConnection();
    console.log(query);
    rows = await conn.query(
      "SELECT * from Stock WHERE stockCode = ?;",
      stockCode
    );
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}
async function saveDataToDatabase(data) {
  let conn;
  try {
    conn = await pool.getConnection();
    rows = await conn.query("SELECT stockCode FROM Stock;");
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

// async function saveStatementData(stockCode, data) {
//   let conn;
//   try {
//     // If data is null, save null values to the database
//     // const bsopPrti = data ? data.bsop_prti : null;
//     const evEbitda = data ? data.ev_ebitda : null;

//     conn = await pool.getConnection();
//     // Use INSERT INTO ... ON DUPLICATE KEY UPDATE to yhandle both insertion and update
//     await conn.query(
//       `INSERT INTO Statement (stockCode, evEbitda )
//        VALUES (?, ?)
//        ON DUPLICATE KEY UPDATE
//        evEbitda  = VALUES(evEbitda );`,
//       [stockCode, evEbitda]
//     );
//     console.log(stockCode, evEbitda);
//   } catch (error) {
//     throw error;
//   } finally {
//     if (conn) conn.release();
//   }
// }

async function getFinStat(stockCode) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    //console.log(conn);
    rows = await conn.query(
      "SELECT * from Statement WHERE stockCode = ?;",
      stockCode
    );
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  GetDataList: GetDataList,
  GetKeyword: GetKeyword,
  getAllStockCodes: getAllStockCodes,
  // saveStatementData: saveStatementData,
  saveDataToDatabase: saveDataToDatabase,
  getFinStat: getFinStat,
  GetsearchList: GetsearchList,
  GetsearchAll: GetsearchAll,
  pool: pool,
};
