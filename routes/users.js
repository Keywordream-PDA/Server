var express = require("express");
var router = express.Router();
const signUp = require('../utils/Signup')

// 회원가입 및 로그인
router.post("/login", async function (req, res, next) {
  const { nickName } = req.body;

  try {
      // MariaDB에서 해당 닉네임을 가진 사용자가 있는지 확인
      const existingUser = await signUp(nickName);

      // 이미 존재하는 사용자인 경우
      if (existingUser === "이미 존재하는 사용자입니다.") {
          res.json({ message: "로그인 성공" }); // 로그인 성공 메시지 전송
      } else {
          res.json({ message: existingUser }); // 회원가입 완료 또는 실패 메시지 전송
      }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;