var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken");
const cron = require("node-cron");

let accessToken = "";

// 서버 실행시마다 access token 발급
const getToken = async () => {
  try {
    accessToken = `Bearer ${await getAccessToken()}`;
    console.log('한투토큰 가져옴')
    // accessToken = 'Bearer eyJ0eXAi...'
  } catch {
  }
};

getToken();

// 오전 6시마다 access token 발급
cron.schedule(
  "0 6 * * *",
  () => {
    console.log("한투토큰 cron 실행");
    getToken();
  },
  {
    scheduled: true,
    timezone: "Asia/Seoul",
  }
)

infoRouter.get("/:stockCode", async function (req, res, next) {
  const stockCode = req.params.stockCode;
  getStockInfo(stockCode, accessToken)
    .then((infoObj) => {
      res.json(infoObj);
    })
    .catch((err) => {
      console.log("DB Connection Failed:", err);
    });
});

module.exports = { infoRouter, accessToken };
