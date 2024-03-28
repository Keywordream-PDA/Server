var express = require("express");
var router = express.Router();
const axios = require("axios");
const { fetchAccessToken } = require("../utils/token/EbestToken.js");

// 변수 관리
function formatDate(date) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

let date = new Date();
let today = formatDate(date);

let yesterdayDate = new Date();
yesterdayDate.setDate(date.getDate() - 1);
let yesterday = formatDate(yesterdayDate);

const chartURL = "https://openapi.ebestsec.co.kr:8080/stock/chart";

// 오늘 차트 데이터 가져오기 (9:00 ~ 현재 시각까지의 종목 시세)
// 만약 장 시작 전이라면, 전날 차트 데이터 가져오기
async function fetchTodayChart(stockCode) {
  const accessToken = await fetchAccessToken();

  // 현재 시각이 9시 이전인지 확인
  const currentTime =
    date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds();
  const isBeforeMarketOpen = currentTime < 90000;

  const chartDate = isBeforeMarketOpen ? yesterday : today;

  const chartConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: chartURL,
    headers: {
      "content-type": "application/json; charset=utf-8",
      authorization: `Bearer ${accessToken}`,
      tr_cd: "t8412",
      tr_cont: "N",
      tr_cont_key: '""',
      mac_address: '""',
    },
    data: {
      t8412InBlock: {
        shcode: `${stockCode}`,
        ncnt: 3, // 3분
        qrycnt: 2000,
        nday: "1",
        sdate: `${chartDate}`,
        stime: "090000",
        edate: `${chartDate}`,
        etime: "153000",
        cts_date: "",
        cts_time: "",
        comp_yn: "N",
      },
    },
  };

  try {
    const response = await axios(chartConfig);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchTodayChart:", error);
    throw error;
  }
}

/* GET: 오늘의 종목 시세 가져오기 (9:00 ~ 현재) */
router.get("/:stockCode", async function (req, res, next) {
  try {
    const stockCode = req.params.stockCode;
    const todayChartData = await fetchTodayChart(stockCode);
    res.json(todayChartData);
  } catch (error) {
    console.error("Error fetching chart api:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
