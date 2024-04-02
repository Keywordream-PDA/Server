var express = require("express");
var router = express.Router();
const maria = require("../database/connect/mariadb");


/* GET : 모든 리스트 가져오기 */
router.get('/all', async function (req, res, next) {
    const {page} = req.query;
    try {
        maria.GetsearchAll(page).then((rows)=>{
            res.json(rows);
        }).catch((err)=>{
            console.log("DB Connection Failed:", err);
            res.json("DB Connection Failed:", err);
        })
    } catch (error) {
        res.status(500).json({ result:"GetsearchAll 오류" });
    }
});

router.get('/count', async function(req, res, next) {
    const {code, name} = req.query;
    const query = {};
    if (code) {
        query.code = code;
    }
    if (name) {
        query.name = name;
    }
    try{
        maria.getSearchCount(query).then((rows) => {
            res.json(rows);
        }).catch((err) => {
            console.log("DB Connection Failed:", err);
            res.json("DB Connection Failed:", err);
        })
    } catch (err) {
        res.status(500).json({ result:"search count query 이상" });
    }
})


/* GET : search 가져오기 */
router.get('/', async function (req, res, next) {
    const { code, name, page } = req.query;  
    const query = {};
    if (code) {
        query.code = code;
    }
    if (name) {
        query.name = name;
    }
    try {
        maria.GetsearchList(query, page).then((rows)=>{
            res.json(rows);
        }).catch((err)=>{
            console.log("DB Connection Failed:", err);
            res.json("DB Connection Failed:", err);
        })
    } catch (error) {
        res.status(500).json({ result: "search query 이상" });
    }
});

module.exports = router;

