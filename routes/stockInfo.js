var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken")
// 서버 실행시 access token 발급
let accessToken = '';

const getToken = async () => {
  try {
    // accessToken = await getAccessToken();
    accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjU3YzcyYmQxLWRjMmQtNDUwNi05ZjRlLWQ3YzJiN2Y3NGRjYyIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMTAzOTgzLCJpYXQiOjE3MTEwMTc1ODMsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.DktA9eEUsmBzrW-KJ19L2jqWM1ndQ_XX08X5627TB2LjiImy68TYfMJGgV-whtGSK5x_o0lgXUiQZwHuHDj46w'
  } catch {

  }
};
getToken();

infoRouter.get('/:stockCode', async function (req, res, next) {
    const stockCode = req.params.stockCode;
    getStockInfo(stockCode, accessToken).then((infoObj) => {
        res.json(infoObj);
    }).catch((err) => {
        console.log("DB Connection Failed:", err);
    });
});

module.exports = {infoRouter, accessToken};
