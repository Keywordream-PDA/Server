const axios = require("axios");
require("dotenv").config();

const tokenURL = "https://openapi.ebestsec.co.kr:8080/oauth2/token";
const appkey = process.env.EBEST_APP_KEY;
const appsecretkey = process.env.EBEST_APP_SECRET_KEY;

// 이베스트투자증권 Access Token 발급
async function fetchAccessToken() {
  const tokenConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: tokenURL,
    params: {
      grant_type: "client_credentials",
      appkey: appkey,
      appsecretkey: appsecretkey,
      scope: "oob",
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.request(tokenConfig);
    const accessToken = tokenResponse.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error in fetchAccessToken:", error);
    throw error;
  }
}

module.exports = { fetchAccessToken };
