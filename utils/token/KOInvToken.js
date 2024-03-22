const axios = require("axios");
require("dotenv").config();
const appkey = process.env.KO_INV_APP_KEY
const appsecret = process.env.KO_INV_APP_SECRET

// Access Token 발급
const getAccessToken = async function(){
  let data = JSON.stringify({
    "grant_type": "client_credentials",
    "appkey": appkey,
    "appsecret": appsecret
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  try {
    const res = await axios.request(config)
    const data = res.data
    return data.access_token
  } catch (error) {
    console.log('한투 access token 발급 실패', error.response.data.error_description);
    throw error; 
  }
}

// 웹소켓 키 발급
const getWebsocketKey = async function(){
  let data = {
    "grant_type" : "client_credentials",
    "appkey": appkey,
    "secretkey": appsecret
  };

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://openapi.koreainvestment.com:9443/oauth2/Approval',
    headers: { 
      'content-type': 'application/json; utf-8'
    },
    data : data
  };
  try {
    const res = await axios.request(config);
    return res.data.approval_key;
  } catch (error) {
    console.log('한투 웹소켓 키 발급 실패', error);
    throw error; 
  }
}


module.exports = { getAccessToken, getWebsocketKey };
