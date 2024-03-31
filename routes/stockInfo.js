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
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImIwZjI1OTg2LWI0YmQtNGVhMi1iYzJhLTE4NThkOGE2OWY0YSIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNzUzODQxLCJpYXQiOjE3MTE2Njc0NDEsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.KddmuBj77hCUTPGo23yQkF1D4XZPDd0wP3LQoe_6Q6n9JewZ5qaaEScsAJSRiahO74BgbdlnRXaKbTKajxV5IA";
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
