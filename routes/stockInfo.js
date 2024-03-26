var express = require("express");
var infoRouter = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken")
// 서버 실행시 access token 발급
let accessToken = '';

const getToken = async () => {
  try {
    // accessToken = await getAccessToken();
    accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjFlZDMxY2YwLTExOTgtNDg0MC04MWI2LWIzM2VhOWIzZTIzYyIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNDk0MjQzLCJpYXQiOjE3MTE0MDc4NDMsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.XHV3KkfOe5TRgUgyFEbbtvLWItFE25jymRrUFUtkqaIwHL9tMpP-wxLJ9C29jiOqIRan3RAR8JN7qNuZCFqdxA'
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
