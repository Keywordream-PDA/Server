const axios = require("axios");
const { pool } = require("../database/connect/mariadb.js");

// 주식 종목 리스트 DB에 저장
async function getStockName(stockCode) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    rows = await conn.query("SELECT * from Stock WHERE stockCode = ?;", stockCode);
    conn.release();
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

// main
async function getStockInfo(stockCode) {
  try {
    // 이 줄에서 한투에 api를 쏘는 함수 실행
    const stockInfo = await getStockName(stockCode);
    return stockInfo
  } catch (error) {
    console.error("Error in getStockInfo:", error);
    throw error
  }
}

// getStockInfo();

module.exports = { getStockName, getStockInfo };
