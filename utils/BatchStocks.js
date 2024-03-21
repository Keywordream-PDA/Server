const axios = require("axios");
const { pool } = require("../database/connect/mariadb.js");
const { fetchAccessToken } = require("./token/EbestToken.js");

const stocksURL = "https://openapi.ebestsec.co.kr:8080/stock/etc";

// 주식 종목 리스트 가져오기
async function fetchStockList(accessToken) {
  const stockListConfig = {
    method: "post",
    url: stocksURL,
    headers: {
      "content-type": "application/json; charset=utf-8",
      authorization: `Bearer ${accessToken}`,
      tr_cd: "t8430",
      tr_cont: "X",
      tr_cont_key: '""',
      mac_address: '""',
    },
    data: '{\r\n    "t8430InBlock" :{\r\n        "gubun" : "0"\r\n    }\r\n}',
  };

  try {
    const response = await axios.request(stockListConfig);
    // console.log(response.data.t8430OutBlock);
    return response.data.t8430OutBlock;
  } catch (error) {
    console.log("Error in fetchStockList:", error);
    throw error;
  }
}

// 주식 종목 리스트 DB에 저장
async function saveStockList(dataList) {
  let conn;
  try {
    conn = await pool.getConnection();

    // 배치 전 레코드 개수 출력
    const countBeforeBatch = `SELECT COUNT(*) AS count FROM Stock;`;
    const [rowsBeforeBatch] = await conn.query(countBeforeBatch);
    console.log("배치 전 stock 개수:", Number(rowsBeforeBatch.count));

    const query = `
      INSERT INTO Stock (stockCode, name, market, updated)
      VALUES (?, ?, ?, CURDATE())
      ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      market = VALUES(market),
      updated = CURDATE();`;
    // stockCode 종목코드, name 이름, section 업종, market 시장, updated 오늘 날짜

    dataList.forEach(async (data) => {
      const values = [data.shcode, data.hname, data.gubun];
      await conn.query(query, values);
    });

    // 배치 (updated 값이 오늘 날짜가 아닌 레코드 삭제)
    const today = new Date().toISOString().slice(0, 10);
    const deleteQuery = `DELETE FROM Stock WHERE updated <> ?;`;
    await conn.query(deleteQuery, [today]);

    // 배치 후 레코드 개수 출력
    const countAfterBatch = `SELECT COUNT(*) AS count FROM Stock;`;
    const [rowsAfterBatch] = await conn.query(countAfterBatch);
    console.log("배치 후 stock 개수:", Number(rowsAfterBatch.count));
    return null;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

// main
async function BatchStocks() {
  try {
    const accessToken = await fetchAccessToken();
    const stockListData = await fetchStockList(accessToken);
    await saveStockList(stockListData);
    process.exit(0);
  } catch (error) {
    console.error("Error in BatchStocks:", error);
  }
}

// BatchStocks();

module.exports = { saveStockList, BatchStocks };
