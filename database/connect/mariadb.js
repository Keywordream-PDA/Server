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
    rows = await conn.query("SELECT data from Keyword WHERE stockCode = ?;", stockCode);
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
    rows = await conn.query("SELECT * from Stock;");
    conn.release();
    return rows;
    //console.log(rows);
  } catch (err) {
    throw err;
  }
}

async function GetsearchList(query) {
  let conn, rows;
  const stockCode = query.code;
  try {
    conn = await pool.getConnection();
    console.log(query);
    rows = await conn.query("SELECT * from Stock WHERE stockCode = ?;", stockCode);
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
    // 데이터베이스에 저장할 쿼리 작성
    const query =
      "INSERT INTO Statement (per, pbr, sale_account, bsop_prti, thtr_ntin, grs, bsop_prfi_inrt, ntin_inrt, roe_val, eps, bps, rsrv_rate, lblt_rate, ev_ebitda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    // 데이터베이스에 저장할 값 설정
    const values = [
      data.per,
      data.pbr,
      data.sale_account,
      data.bsop_prti,
      data.thtr_ntin,
      data.grs,
      data.bsop_prfi_inrt,
      data.ntin_inrt,
      data.roe_val,
      data.eps,
      data.bps,
      data.rsrv_rate,
      data.lblt_rate,
      data.ev_ebitda,
    ];
    // 쿼리 실행
    await conn.query(query, values);
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  GetDataList: GetDataList,
  GetKeyword: GetKeyword,
  GetsearchList:GetsearchList,
  GetsearchAll: GetsearchAll,
  pool : pool
};

// Statement : DB 이름
