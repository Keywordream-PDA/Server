var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken");
const cron = require("node-cron");

let accessToken = "";

// 서버 실행시마다 access token 발급
const getToken = async () => {
  try {
    // const data = await getAccessToken()
    // accessToken = 'Bearer ' + data
    // console.log('한투토큰 가져옴', accessToken)
    accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjExYTk3YTgxLWVjMmUtNDZhZC05ZmNhLTFjYjliMTVmZjExZiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzEyMDk4NjYyLCJpYXQiOjE3MTIwMTIyNjIsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.7dlAlSAKsUtb5CHUu7MF48LcyjXiByccB5oGpRETttfrXjhDZpMw9DKkrJAiYLrcBWaQ9xC2shQKv_eEIwGLyw'
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
