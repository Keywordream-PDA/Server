const { json } = require('body-parser');
const express = require('express')
const router = express.Router()
const trendAPI = require('google-trends-api')
const { fetchMostExchanged, fetchMostIncreased, fetchMostViewed } = require('../utils/Shinhan')

router.get('/hot', function(req, res, next){
    // 한국 시간 기준으로 현재 날짜 계산
    const now = new Date();
    const krTimezoneOffset = 9 * 60; // 한국 시간대는 UTC+9
    const krNow = new Date(now.getTime() + krTimezoneOffset * 60 * 1000);
    const krDateString = krNow.toISOString().slice(0, 10);
    trendAPI.dailyTrends({
    trendDate: new Date(krDateString),
    geo: 'KR',
    }, function(err, results) {
    if (err) {
        console.error(err);
    } else {
        try {
            const jsonData = JSON.parse(results);
            let trendingSearches = [];

            for (let i = 0; i < jsonData.default.trendingSearchesDays.length; i++) {
                const day = jsonData.default.trendingSearchesDays[i];
                if (day.trendingSearches && day.trendingSearches.length > 0) {
                    let limit = 3;
                    if (i === 0 && day.trendingSearches.length < 3) {
                        limit = day.trendingSearches.length;
                    }
                    for (let j = 0; j < limit; j++) {
                        trendingSearches.push(day.trendingSearches[j]);
                    }
                    if (trendingSearches.length >= 3) {
                        break; // 최대 3개의 트렌드만 가져오기 위해 루프 종료
                    }
                }
            }

            res.send(trendingSearches);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
        }
    }
    });
})
let mostExchanged = [];
let mostIncreased = [];
let mostViewed = [];

const fetchData = async () => {
    try {
      mostExchangedRes = await fetchMostExchanged();
      mostIncreasedRes = await fetchMostIncreased();
      mostViewedRes = await fetchMostViewed();
      mostExchanged = mostExchangedRes.dataBody
      mostIncreased = mostIncreasedRes.dataBody
      mostViewed = mostViewedRes.dataBody
      console.log('Data updated successfully.');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

// 초기 데이터 로드
fetchData();
// 주기적으로 데이터 갱신
setInterval(fetchData, 60000); // 1분마다 갱신

router.get('/most-exchanged', (req, res) => {
  res.json(mostExchanged);
});

router.get('/most-increased', (req, res) => {
  res.json(mostIncreased);
});

router.get('/most-viewed', (req, res) => {
  res.json(mostViewed);
});

module.exports = router
