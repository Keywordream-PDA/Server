var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken");
// 서버 실행시 access token 발급
let accessToken = "";

const getToken = async () => {
  try {
    // accessToken = await getAccessToken();
    accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjBhMDEwZmEwLWMzMDEtNDRkNS1iYThhLWMxZDc3OTZiYmM0NyIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNTg0ODEzLCJpYXQiOjE3MTE0OTg0MTMsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.efmlzGYdYHpAfaAo_YJfJIwx6DEaJdb-p_udCFclpi-3Z7-mdSp98z_b_JpMUpoYV4jzoTHGUv3jncO5sLGeSw'
  } catch {

  }
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
