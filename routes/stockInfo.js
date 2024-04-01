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
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImUwOGUxMTBlLTRhYzEtNDIzOC05Y2FlLThkMDQ0Y2MxNjI2YSIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExOTUzNTE2LCJpYXQiOjE3MTE4NjcxMTYsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.ItR7CxzUwIaysegJfplsNKKkYc0Ys5gnUtr_Vu_TYre9zF5nXRXp1cCSbJdbDj-dNgd2ODM98Au4L2ukSBVBgA";
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
