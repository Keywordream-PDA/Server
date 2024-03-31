const axios = require("axios");

const getKeywordsWithDetails = async () => {
  try {
    // API 요청을 보냄
    const response = await axios.get(
      "https://api.thinkpool.com/socialAnalysis/keyword"
    );

    // API 응답에서 키워드 값만 추출하여 가져옴
    const keywords = response.data.list
      .slice(0, 10)
      .map((item) => item.keyword);

    // 추가 정보를 가져오기 위해 issn 값을 이용하여 API 요청을 보냄
    const keywordDetailsPromises = response.data.list
      .slice(0, 10)
      .map(async (item) => {
        const detailResponse = await axios.get(
          `https://api.thinkpool.com/socialAnalysis/keywordCodeList?&issn=${item.issn}`
        );
        return detailResponse.data;
      });

    // 추가 정보를 기다림
    const keywordDetails = await Promise.all(keywordDetailsPromises);

    // 키워드와 추가 정보를 합쳐서 반환
    const combinedData = keywords.map((keyword, index) => ({
      keyword,
      details: keywordDetails[index],
    }));

    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

module.exports = getKeywordsWithDetails;
