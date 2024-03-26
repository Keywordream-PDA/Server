const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const router = express.Router();
require('dotenv').config()

let accessToken = null;

// Function to fetch access token
const fetchAccessToken = async () => {
  const tokenUrl = "https://openapi.koreainvestment.com:9443/oauth2/tokenP";
  const body = {
    grant_type: "client_credentials",
    appkey: process.env.KO_INV_APP_KEY,
    appsecret: process.env.KO_INV_APP_SECRET
  };

  try {
    const response = await axios.post(tokenUrl, body);
    accessToken = response.data.access_token;
    console.log("Access token fetched successfully.");
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error; // Rethrow the error to handle it appropriately
  }
};

// Schedule cron job to fetch access token daily at a specific time (e.g., 2:00 AM)
cron.schedule("0 2 * * *", async () => {
  try {
    await fetchAccessToken();
  } catch (error) {
    console.error("Error scheduling cron job:", error);
  }
});

// Middleware to set authorization header with fetched access token
const setAuthorizationHeader = (req, res, next) => {
  if (!accessToken) {
    return res.status(500).json({ error: "Access token not available." });
  }
  req.accessToken = accessToken;
  next();
};
/* GET home page. */
router.get("/:stockCode/day", async (req, res) => {
  const stockCode = req.params.stockCode;
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDateString =
      yesterday.toISOString().substring(0, 4) +
      yesterday.toISOString().substring(5, 7) +
      yesterday.toISOString().substring(8, 10);

    const url =
      "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";

    const query = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: stockCode,
      FID_INPUT_DATE_1: "20231024",
      FID_INPUT_DATE_2: formattedDateString,
      FID_PERIOD_DIV_CODE: "D",
      FID_ORG_ADJ_PRC: "0",
    });

    const headers = {
      "Content-type": "application/json",
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjFlZDMxY2YwLTExOTgtNDg0MC04MWI2LWIzM2VhOWIzZTIzYyIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExNDk0MjQzLCJpYXQiOjE3MTE0MDc4NDMsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.XHV3KkfOe5TRgUgyFEbbtvLWItFE25jymRrUFUtkqaIwHL9tMpP-wxLJ9C29jiOqIRan3RAR8JN7qNuZCFqdxA",
      appkey: process.env.KO_INV_APP_KEY,
      appsecret: process.env.KO_INV_APP_SECRET,
      tr_id: "FHKST03010100",
    };

    const response = await axios.get(`${url}?${query.toString()}`, {
      headers: headers,
    });
    const responseData = response.data;
    // console.log(responseData);

    const extractedData = responseData.output2.map((item) => {
      return {
        stck_bsop_date: item.stck_bsop_date,
        stck_clpr: item.stck_clpr,
        acml_vol: item.acml_vol,
        acml_tr_pbmn: item.acml_tr_pbmn,
      };
    });

    res.json(extractedData);
  } catch (error) {
    console.error("Error while fetching external API:", error);
    res.status(500).json({ error: "Internal server error2" });
  }
});

module.exports = router;

//날짜, 종가, 등락률, 거래량(주), 거래대금
