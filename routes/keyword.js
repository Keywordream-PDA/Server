var express = require("express");
var router = express.Router();
const maria = require("../database/connect/mariadb");


/* GET : keyword 가져오기 */
router.get('/:stockCode', async function (req, res, next) {
    const stockCode = req.params.stockCode;
    maria.GetKeyword(stockCode).then((rows) => {
        const result = rows[0].data;
        res.json(result);
        // console.log(result);
    }).catch((err) => {
        console.log("DB Connection Failed:", err);
    });
});

module.exports = router;
