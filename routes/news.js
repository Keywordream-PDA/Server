const express = require('express');
const getNewsList = require('../database/news/list');
const {getTimeAgo, getTimeDetail} = require('../utils/time');
const getNewsDetail = require('../database/news/detail');
const getTagTop3 = require('../database/news/tag');
const router = express.Router();

router.post('/tags', async (req, res, next) => {
    const {stockCode} = req.body
    try{
      const tagTop3 = await getTagTop3(stockCode)
      res.json(tagTop3)
    } catch {
      console.log("news의 tags에서 오류")
      throw error;
    }
});

router.post('/list', async(req, res, next) => {
    const {stockCode} = req.body
    try{
        let newsList = await getNewsList(stockCode);
        if(newsList !== undefined){
            newsList.forEach(news => {
                news.newsDate = getTimeAgo(news.newsDate)
            });
        } else {
            newsList = []
        }
        res.json(newsList);
    } catch(error){
        console.log("news의 list에서 오류")
        throw error
    }
})

router.post('/detail', async(req, res, next) => {
    const {stockCode, newsId} = req.body
    try{
        const newsDetail = await getNewsDetail(newsId);
        newsDetail.newsDate = getTimeDetail(newsDetail.newsDate)
        newsDetail.content = await applyKeywordToContent(newsDetail.content, stockCode)
        res.json(newsDetail)
    } catch{
        console.log("news의 detail에서 오류")
        throw error
    }
})

const applyKeywordToContent = async (content, stockCode) => {
    try {
        const tagTop3 = await getTagTop3(stockCode);
        console.log(tagTop3)
        console.log(typeof content)
        tagTop3.forEach(tag => {
            const regex = new RegExp(tag, "g");
            content = content.replace(regex, `<span style="background-color: #e2e8ff">${tag}</span>`);
        });
        return content;
    } catch (error) {
        console.log("content에서 keyword 적용 오류:", error);
        throw error;
    }
}

module.exports = router;