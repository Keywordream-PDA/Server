var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken");
// 서버 실행시 access token 발급
let accessToken = "";

const getToken = async () => {
  try {
    // accessToken = await getAccessToken();
    accessToken =
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImVkZWEzNDE2LWYwYWQtNDY4MC04ODgwLTNlNzdmM2IwNTdlOSIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNjY2ODk2LCJpYXQiOjE3MTE1ODA0OTYsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.ZrgGMgAr_oFiVbjSZoN7RdJR7xyPycxqyDQq9inL0AC8PBmrjW6qH3XYCBfKC39sYiy8azDlVvznrze54-sGNw";
  } catch {}
};
getToken();

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
