const cron = require("node-cron");
const { getTodayDay, isOpenMarketTime } = require("./time");
const axios = require("axios");
require('dotenv').config()

// 오늘이 장 열리는 날인지
let isOpenMarket = true;

// 매일 오전 8시에 오늘이 주식 시장이 열리는지 그렇지 않은지 검사
cron.schedule('0 8 * * *', async () => {
    const DOMESTIC_MARKET_HOLIDAY = "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/chk-holiday"

    const headers = {
        "Content-type": "application/json",
        authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjBhMDEwZmEwLWMzMDEtNDRkNS1iYThhLWMxZDc3OTZiYmM0NyIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNTg0ODEzLCJpYXQiOjE3MTE0OTg0MTMsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.efmlzGYdYHpAfaAo_YJfJIwx6DEaJdb-p_udCFclpi-3Z7-mdSp98z_b_JpMUpoYV4jzoTHGUv3jncO5sLGeSw",
        appkey: process.env.KO_INV_APP_KEY,
        appsecret: process.env.KO_INV_APP_SECRET,
        tr_id: "CTCA0903R",
        custtype: "P"
    };

    const query = new URLSearchParams({
        BASS_DT: getTodayDay(),
        CTX_AREA_NK: "",
        CTX_AREA_FK: ""
    });

    const response = await axios.get(`${DOMESTIC_MARKET_HOLIDAY}?${query.toString()}`, {
        headers: headers,
    });

    isOpenMarket = (response.data.output[0].opnd_yn === 'Y');
})

const isOpenSocket = () => {
    if (isOpenMarket && isOpenMarketTime()) {
        return true;
    }
    return false;
}

module.exports = {
    isOpenSocket: isOpenSocket,
}