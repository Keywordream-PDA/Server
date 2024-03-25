var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken")
// 서버 실행시 access token 발급
let accessToken = '';

const getToken = async () => {
  try {
    // accessToken = await getAccessToken();
    accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImIwODQzMjhjLTZmMGQtNDE2MC1iYTJmLTY2NDkwZmQ1ODVjZSIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNDExODMyLCJpYXQiOjE3MTEzMjU0MzIsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.vEn2clBUfsVWUrMuJzMHg322rYE4PBoQimD3wPkqVy83nwkm_LdbsBXicvWs28xWp3o0qgOl3mU16sQ1VMZJ4w'
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
