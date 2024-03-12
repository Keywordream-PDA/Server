const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 외부 API의 엔드포인트 설정
    const apiUrl =
      "http://apis.data.go.kr/1160100/service/GetFinaStatInfoService_V2/getSummFinaStat_V2";

    // 요청 파라미터 설정
    const params = {
      numOfRows: 10,
      pageNo: 3,
      resultType: "json",
      serviceKey:
        "NLC+mtKFJc/p7FecSKRqhgjKLIIts8gXoiZ0oZDrFn0GJs4/iu1MevewttDuHRmIOfbdIhvMGx7Gcbl5dQXa5g==",
      // crno: "1746110000741", // 법인등록번호
      // 사업연도
    };

    // 외부 API 호출
    const response = await axios.get(apiUrl, { params });
    console.log(response.data);

    // 외부 API로부터 받은 전체 데이터를 클라이언트로 전송
    return res.json(response.data);
  } catch (error) {
    console.error("Error while fetching external API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
