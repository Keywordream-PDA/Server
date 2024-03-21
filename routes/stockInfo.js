var express = require("express");
var router = express.Router();
const { getStockInfo } = require("../utils/StockInfo");


/* GET : keyword 가져오기 */
router.get('/:stockCode', async function (req, res, next) {
    console.log('들어옴')
    const stockCode = req.params.stockCode;
    getStockInfo(stockCode).then((rows) => {
        const result = rows[0].name;
        res.json(result);
    }).catch((err) => {
        console.log("DB Connection Failed:", err);
    });
});

module.exports = router;
