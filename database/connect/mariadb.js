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
    rows = await conn.query("SELECT * from User;");
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
async function GetsearchAll(pageNumber) {
  const pageSize = 50;
  let conn, rows;
  try {
    conn = await pool.getConnection();
    const offset = pageNumber * pageSize
    //console.log(conn);
    rows = await conn.query(`SELECT * from Stock LIMIT ${pageSize} OFFSET ${offset};`);
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}

async function getSearchCount(query){
  let conn, rows;
  const stockCode = query.code;
  const stockName = query.name;
  try {
    conn = await pool.getConnection();
    if(stockCode){
      rows = await conn.query(
        `SELECT COUNT(*) from Stock WHERE stockCode LIKE '%${stockCode}%';`
      );
    } else if(stockName) {
      rows = await conn.query(
        `SELECT COUNT(*) from Stock WHERE name LIKE '%${stockName}%';`
      );
    } else {
      rows = await conn.query(
        `SELECT COUNT(*) FROM Stock;`
      );
    }
    conn.release();
    const countResult = rows[0];
    return countResult['COUNT(*)'].toString();
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}

async function getAllStockCodes() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log(offset);
    rows = await conn.query(`SELECT stockCode FROM Stock`);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

async function GetsearchList(query, pageNumber) {
  const pageSize = 50;
  const offset = pageNumber * pageSize
  let conn, rows;
  const stockCode = query.code;
  const stockName = query.name;
  try {
    conn = await pool.getConnection();
    if(stockCode){
      console.log("stockCode : " + stockCode);
      rows = await conn.query(
        `SELECT * from Stock WHERE stockCode LIKE '%${stockCode}%' LIMIT ${pageSize} OFFSET ${offset};`
      );
    } else if(stockName) {
      console.log("stockName : " + stockName);
      rows = await conn.query(
        `SELECT * from Stock WHERE name LIKE '%${stockName}%' LIMIT ${pageSize} OFFSET ${offset};`
      );
    } else {
      rows = await conn.query(
        `SELECT * FROM Stock LIMIT ${pageSize} OFFSET ${offset};`
      );
    }
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
  getSearchCount:getSearchCount,
  pool: pool,
};
