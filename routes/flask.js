const express = require("express");
const router = express.Router();
const axios = require("axios");

const FLASK_RUL = "http://43.202.201.221/:5000/api";

router.post("/news", async (req, res, next) => {
  const { code } = req.body;
  try {
    const response = await axios.post(`${FLASK_RUL}/news`, {
      // name : name,
      code: code,
    });
    if (response.status === 200) {
      res.status(200).send();
    }
  } catch (error) {
    console.log("flask의 news에서 오류 : " + error);
    res.status(404).send();
  }
});

router.post("/krFinBert", async (req, res, next) => {
  const { newsId } = req.body;
  try {
    const response = await axios.post(`${FLASK_RUL}/krFinBert`, {
      newsId: newsId,
    });
    console.log("결과 : " + response.data);
    if (response.status === 200) {
      res.json({ isGood: response.data });
    }
  } catch (error) {
    console.log("flask의 krFinBert에서 오류 : " + error);
    throw error;
  }
});

module.exports = router;
