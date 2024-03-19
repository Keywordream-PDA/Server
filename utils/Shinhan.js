const axios = require('axios')
require("dotenv").config();
const apiKey = process.env.SHINHAN_API_KEY;
const baseURL = 'https://gapi.shinhaninvest.com:8443/openapi/v1.0/ranking';
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'apiKey': apiKey
  }
});

// 거래량순
exports.fetchMostExchanged = async () => {
  try {
    const response = await axiosInstance.get('/issue', {
      params: {
        query_type: 1
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching most exchanged:', error);
    throw error;
  }
};

// 주가상승순
exports.fetchMostIncreased = async () => {
  try {
    const response = await axiosInstance.get('/issue', {
      params: {
        query_type: 2
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching most increased:', error);
    throw error;
  }
};

// 조회수순
exports.fetchMostViewed = async () => {
  try {
    const response = await axiosInstance.get('/rising');
    return response.data;
  } catch (error) {
    console.error('Error fetching most viewed:', error);
    throw error;
  }
};