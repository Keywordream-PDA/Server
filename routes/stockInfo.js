var express = require("express");
var router = express.Router();
const { getStockInfo } = require("../utils/StockInfo");
const { getAccessToken } = require("../utils/token/KOInvToken")
// 서버 실행시 access token 발급
let accessToken = '';

const getToken = async () => {
  try {
    // accessToken = await getAccessToken();
  } catch {

  }
};
getToken();


/* GET : keyword 가져오기 */
router.get('/:stockCode', async function (req, res, next) {
    const stockCode = req.params.stockCode;
    getStockInfo(stockCode, accessToken).then((infoObj) => {
        res.json(infoObj);
    }).catch((err) => {
        console.log("DB Connection Failed:", err);
    });
});

module.exports = router;
