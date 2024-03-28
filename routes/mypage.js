const express = require('express');
const router = express.Router();
const { getMyStocks, addMyStock, deleteMyStock } = require('../utils/MyStock');

router.post('/fetch', async (req, res, next) => {
  try {
    const nickName = req.body.nickName; // 클라이언트에서 넘어온 닉네임
    const myStocks = await getMyStocks(nickName);
    res.json(myStocks);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const { nickName, stockCode } = req.body; // 클라이언트에서 넘어온 닉네임과 주식 코드
    const result = await addMyStock(nickName, stockCode);
    res.json({ message: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    const { nickName, stockCode } = req.body; // 클라이언트에서 넘어온 닉네임과 주식 코드
    const result = await deleteMyStock(nickName, stockCode);
    res.json({ message: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
