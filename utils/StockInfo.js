const axios = require("axios");
const { pool } = require("../database/connect/mariadb.js");
require('dotenv').config()

// 주식 종목 리스트 DB에 저장
async function getStockName(stockCode) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    rows = await conn.query("SELECT * from Stock WHERE stockCode = ?;", stockCode);
    conn.release();
    return rows[0]
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

async function getStockPrice(stockCode, accessToken){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stockCode}`,
    headers: { 
      'content-type': 'application/json; charset=utf-8', 
      'authorization': accessToken, 
      'appkey': process.env.KO_INV_APP_KEY, 
      'appsecret': process.env.KO_INV_APP_SECRET,
      'tr_id': 'FHKST01010100'
    }
  };

  try {
    const response = await axios.request(config);
    const output = response.data.output;
    const res = { price: output.stck_prpr, ratio: output.prdy_ctrt };
    return res;
  } catch (error) {
    console.log(error);
    throw error; // 오류를 다시 throw하여 호출 쪽에서 처리할 수 있도록 합니다.
  }
}

// main
async function getStockInfo(stockCode, accessToken) {
  try {
    const [stockName, stockPrice] = await Promise.all([getStockName(stockCode), getStockPrice(stockCode, accessToken)])
    return {stockName: stockName, stockPrice: stockPrice}
  } catch (error) {
    console.error("Error in getStockInfo:", error); 
    throw error
  }
}

module.exports = { getStockPrice, getStockInfo };
