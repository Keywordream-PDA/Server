const axios = require("axios");
const { pool } = require("../database/connect/mariadb.js");
const moment = require("moment");

// 토큰 발급
async function fetchAccessToken() {
  const tokenConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://openapi.ebestsec.co.kr:8080/oauth2/token?grant_type=client_credentials&appkey=PSPhjLFhHjn3wXWG43tmUWxtlrYey7YmpSOo&appsecretkey=uWjrrjYPhstCRtVlPua6sHfamW1t1QOF&scope=oob",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.request(tokenConfig);
    const accessToken = tokenResponse.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error in fetchAccessToken:", error);
    throw error;
  }
}

// 주식 종목 리스트 가져오기
async function fetchStockList(accessToken) {
  const stockListConfig = {
    method: "post",
    url: "https://openapi.ebestsec.co.kr:8080/stock/etc",
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

    const query = `
      INSERT INTO Stock (stockCode, name, market, updated)
      VALUES (?, ?, ?, CURDATE())
      ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      market = VALUES(market),
      updated = CURDATE();`;
    // stockCode 종목코드, name 이름, section 업종, market 시장

    dataList.forEach(async (data) => {
      const values = [data.shcode, data.hname, data.gubun];
      await conn.query(query, values);
    });

    // 배치 (updated 값이 오늘 날짜가 아닌 레코드 삭제)
    const today = new Date().toISOString().slice(0, 10);
    const deleteQuery = `DELETE FROM Stock WHERE updated <> ?;`;
    await conn.query(deleteQuery, [today]);
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
