var express = require("express");
const axios = require("axios");
var router = express.Router();

// Function to fetch access token
const fetchAccessToken = async () => {
  const tokenUrl = "https://openapi.koreainvestment.com:9443/oauth2/tokenP";
  const body = {
    grant_type: "client_credentials",
    appkey: "PSzo0xRNAXE6XyA5OJdkmSJIYwuVUGgSHg2l",
    appsecret:
      "HFPFfK5VyqCgIHgitad9JFcSlUWhEOmiTD2MOTYIt9jlrj/KxKGz/kU3z2kGcmO/vtxHvMPLHtIAi7j4r+TEhBHNzYI9xv/fd6n/h5E6Mrm3k4lVQeSNygL+W/w206htErKXKkUsz2CCI3UcD9xQMHDfsS+5LZy2JeZCK9gvnAAJNGOFNug=",
  };

  try {
    const response = await axios.post(tokenUrl, body);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error; // Rethrow the error to handle it appropriately
  }
};

// Middleware to set authorization header with fetched access token
const setAuthorizationHeader = async (req, res, next) => {
  try {
    const accessToken = await fetchAccessToken();
    req.accessToken = accessToken;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error fetching access token" });
  }
};

/* GET home page. */
router.get("/day", setAuthorizationHeader, async (req, res) => {
  try {
    const url =
      "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";

    const query = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: "005930",
      FID_INPUT_DATE_1: "20230319",
      FID_INPUT_DATE_2: "20240319",
      FID_PERIOD_DIV_CODE: "D",
      FID_ORG_ADJ_PRC: "0",
    });

    const headers = {
      "Content-type": "application/json",
      authorization: `Bearer ${req.accessToken}`,
      tr_id: "FHKST03010100",
    };

    const response = await axios.get(`${url}?${query.toString()}`, {
      headers: headers,
    });
    const responseData = response.data;
    console.log(responseData);

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
