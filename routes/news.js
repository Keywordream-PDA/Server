const express = require('express');
const getTags = require('../database/news/tag');
const getNewsList = require('../database/news/list');
const getTimeAgo = require('../utils/time');
const router = express.Router();

router.post('/tags', async (req, res, next) => {
    const {stockCode} = req.body
    try{
      const tags = await getTags(stockCode)
      const tagTop3 = [tags[0].word, tags[1].word, tags[2].word]
      res.json(tagTop3)
    } catch {
      console.log("news의 tags에서 오류")
      throw error;
    }
});

router.post('/list', async(req, res, next) => {
    const {stockCode} = req.body
    try{
        const newsList = await getNewsList(stockCode);
        newsList.forEach(news => {
            news.newsDate = getTimeAgo(news.newsDate)
        });
        res.json(newsList);
    } catch{
        console.log("news의 list에서 오류")
        throw error
    }
})

module.exports = router;