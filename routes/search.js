var express = require("express");
var router = express.Router();
const maria = require("../database/connect/mariadb");


/* GET : 모든 리스트 가져오기 */
router.get('/all', async function (req, res, next) {
    try {
        maria.GetsearchAll().then((rows)=>{
            res.json(rows);
        }).catch((err)=>{
            console.log("DB Connection Failed:", err);
            res.json("DB Connection Failed:", err);
        })

    } catch (error) {
        res.status(500).json({ result:"GetsearchAll 오류" });
    }
});


/* GET : search 가져오기 */
router.get('/', async function (req, res, next) {
    try {
        const { code, name } = req.query;
        // Create a query object based on the provided parameters
        const query = {};
        if (code) {
          query.code = code;
        }
        if (name) {
          // 이름 부분 검색을 위해 정규 표현식 사용
          query.name = name;
        }
        maria.GetsearchList(query).then((rows)=>{
            res.json(rows);
        }).catch((err)=>{
            console.log("DB Connection Failed:", err);
            res.json("DB Connection Failed:", err);
        })

    } catch (error) {
        res.status(500).json({ result:"search query 이상" });
    }
});

module.exports = router;

