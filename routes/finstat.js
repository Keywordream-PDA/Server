const express = require("express");
const axios = require("axios");
const router = express.Router();
const mariadb = require("../database/connect/mariadb");
require('dotenv').config()

router.get("/:stockCode/info", async (req, res) => {
  const stockCode = req.params.stockCode;
  try {
    const rows = await mariadb.getFinStat(stockCode);
    if (rows.length > 0) {
      // 가져온 데이터를 그대로 클라이언트에 반환
      res.json(rows);
    } else {
      res
        .status(404)
        .json({ error: "Data not found for the given stock code" });
      console.log("재무제표 존재하지 않음", stockCode);
    }
  } catch (err) {
    console.error("DB Connection Failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/info", async (req, res) => {
//   try {
//     // Get all stock codes from the database
//     const stockCodes = await mariadb.getAllStockCodes();

//     // Log the retrieved stock codes for testing
//     console.log("Retrieved stock codes:", stockCodes);

//     // Counter for tracking the number of requests sent
//     let requestCount = 0;

//     // Function to send requests with a delay
//     const sendRequestWithDelay = async (stock) => {
//       try {
//         // Get stock data for each stock code
//         const stockData = await getStockData(stock.stockCode);

//         // Save stock data to the database
//         await mariadb.saveStatementData(stock.stockCode, stockData);

//         // Increment request count
//         requestCount++;

//         // Check if the request count exceeds the limit
//         if (requestCount < stockCodes.length && requestCount % 15 === 0) {
//           // Wait for 1 second before sending the next request
//           await new Promise((resolve) => setTimeout(resolve, 1000));
//         }
//       } catch (error) {
//         console.error("Error while fetching stock data:", error);
//       }
//     };

//     // Loop through each stock code and send requests
//     for (const stock of stockCodes) {
//       await sendRequestWithDelay(stock);
//     }

//     // Return response to the client
//     res.json({ message: "Successfully retrieved and saved stock data" });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// async function getStockData(stockCode) {
//   const apiUrl =
//     "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/income-statement";

//   const queryParameters = new URLSearchParams({
//     FID_DIV_CLS_CODE: "0",
//     FID_COND_MRKT_DIV_CODE: "J",
//     FID_INPUT_ISCD: stockCode,
//   });

//   const headers = {
//     authorization:
//       "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImMzNDc0ZmMwLWYzNDEtNGE0MC04NjIzLWEyMzU4ZTI3NWM4NiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMTU0NjgwLCJpYXQiOjE3MTEwNjgyODAsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.o_xYn7xzMGaelPtgfC7zZK_zHCvbpb1YGF5Zn_mRQIJELAUkBzbRKRvhOhdkj8dn72izv0qccK-po0bYwNFtPA",
//     appkey: process.env.KO_INV_APP_KEY,
//     appsecret: process.env.KO_INV_APP_SECRET,
//     tr_id: "FHKST66430500",
//     custtype: "P",
//   };

//   const response = await axios.get(`${apiUrl}?${queryParameters.toString()}`, {
//     headers,
//   });
//   const responseData = response.data;

//   // Check if responseData.output[0] is undefined
//   if (!responseData.output[0]) {
//     console.error(`No data found for stock code: ${stockCode}`);
//     return null;
//   }

//   // Extract necessary data from the response
//   const { ev_ebitda } = responseData.output[0];

//   // Return the extracted data
//   return {
//     // bsop_prti,
//     ev_ebitda,y
//     // Add more fields as needed
//   };
// }

module.exports = router;

// router.get("/info", async (req, res) => {
//   try {
//     // 1. 주식현재가 시세 API
//     const apiUrl1 =
//       "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price";

//     const queryParameters1 = new URLSearchParams({
//       FID_COND_MRKT_DIV_CODE: "J",
//       FID_INPUT_ISCD: "005930",
//     });

//     const headers1 = {
//       authorization:
//         "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjZkNzg5ODJkLTIxNDktNDQ0My1hZGUwLTRjZmE1NDFmNjEwMCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMDYyNTQwLCJpYXQiOjE3MTA5NzYxNDAsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.VD-yqE-OsWwxXsmDUeWrWlESk8QdfimXUxokolBhQEpW0fxAZdF1GxGoq8N2umCzYceMkcknCfyA79cAuWMDBQ",
//       appkey: process.env.KO_INV_APP_KEY,
//       appsecret: process.env.KO_INV_APP_SECRET,
//       tr_id: "FHKST01010100",
//     };

//     const response1 = await axios.get(
//       `${apiUrl1}?${queryParameters1.toString()}`,
//       { headers: headers1 }
//     );
//     const responseData1 = response1.data;

//     // "per"과 "pbr"
//     const { per, pbr } = responseData1.output;

//     // 2. 국내주식 손익계산서 API
//     const apiUrl2 =
//       "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/income-statement";

//     const queryParameters2 = new URLSearchParams({
//       FID_DIV_CLS_CODE: "0",
//       fid_cond_mrkt_div_code: "J",
//       fid_input_iscd: "005930",
//     });

//     const headers2 = {
//       "content-type": "application/json; charset=utf-8",
//       authorization:
//         "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjZkNzg5ODJkLTIxNDktNDQ0My1hZGUwLTRjZmE1NDFmNjEwMCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMDYyNTQwLCJpYXQiOjE3MTA5NzYxNDAsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.VD-yqE-OsWwxXsmDUeWrWlESk8QdfimXUxokolBhQEpW0fxAZdF1GxGoq8N2umCzYceMkcknCfyA79cAuWMDBQs",
//       appkey: process.env.KO_INV_APP_KEY,
//       appsecret: process.env.KO_INV_APP_SECRET,
//       tr_id: "FHKST66430200",
//       custtype: "P",
//     };

//     const response2 = await axios.get(
//       `${apiUrl2}?${queryParameters2.toString()}`,
//       { headers: headers2 }
//     );
//     const responseData2 = response2.data;
//     const { stac_yymm, sale_account, bsop_prti, thtr_ntin } =
//       responseData2.output[0];

//     // 3. 국내주식 재무비율
//     const apiUrl3 =
//       "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/financial-ratio";

//     const queryParameters3 = new URLSearchParams({
//       FID_DIV_CLS_CODE: "0",
//       fid_cond_mrkt_div_code: "J",
//       fid_input_iscd: "005930",
//     });

//     const headers3 = {
//       "content-type": "application/json; charset=utf-8",
//       authorization:
//         "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjZkNzg5ODJkLTIxNDktNDQ0My1hZGUwLTRjZmE1NDFmNjEwMCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMDYyNTQwLCJpYXQiOjE3MTA5NzYxNDAsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.VD-yqE-OsWwxXsmDUeWrWlESk8QdfimXUxokolBhQEpW0fxAZdF1GxGoq8N2umCzYceMkcknCfyA79cAuWMDBQ",
//       appkey: process.env.KO_INV_APP_KEY,
//       appsecret: process.env.KO_INV_APP_SECRET,
//       tr_id: "FHKST66430300",
//       custtype: "P",
//     };

//     const response3 = await axios.get(
//       `${apiUrl3}?${queryParameters3.toString()}`,
//       { headers: headers3 }
//     );
//     const responseData3 = response3.data;
//     const {
//       grs,
//       bsop_prfi_inrt,
//       ntin_inrt,
//       roe_val,
//       eps,
//       bps,
//       rsrv_rate,
//       lblt_rate,
//     } = responseData3.output[0];

//     // 4. 국내주식 기타주요비율

//     const apiUrl4 =
//       "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/other-major-ratios";

//     const queryParameters4 = new URLSearchParams({
//       FID_DIV_CLS_CODE: "0",
//       fid_cond_mrkt_div_code: "J",
//       fid_input_iscd: "005930",
//     });

//     const headers4 = {
//       "content-type": "application/json; charset=utf-8",
//       authorization:
//         "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjZkNzg5ODJkLTIxNDktNDQ0My1hZGUwLTRjZmE1NDFmNjEwMCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMDYyNTQwLCJpYXQiOjE3MTA5NzYxNDAsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.VD-yqE-OsWwxXsmDUeWrWlESk8QdfimXUxokolBhQEpW0fxAZdF1GxGoq8N2umCzYceMkcknCfyA79cAuWMDBQ",
//       appkey: process.env.KO_INV_APP_KEY,
//       appsecret: process.env.KO_INV_APP_SECRET,
//       tr_id: "FHKST66430500",
//       custtype: "P",
//     };

//     const response4 = await axios.get(
//       `${apiUrl4}?${queryParameters4.toString()}`,
//       { headers: headers4 }
//     );

//     const responseData4 = response4.data;
//     const { ev_ebitda } = responseData4.output[0];

//     // const mappedData = {
//     //   per,
//     //   pbr,
//     //   saleAccount: sale_account,
//     //   bsopPrti: bsop_prti,
//     //   thtrNtin: thtr_ntin,
//     //   grs,
//     //   bsopPrfiInrt: bsop_prfi_inrt,
//     //   ntinInrt: ntin_inrt,
//     //   roeVal: roe_val,
//     //   eps,
//     //   bps,
//     //   rsrvRate: rsrv_rate,
//     //   lbltRate: lblt_rate,
//     //   evEbitda: ev_ebitda,
//     // };

//     // // 데이터베이스에 저장
//     // await mariadb.saveDataToDatabase(mappedData);

//     // 클라이언트에 per과 pbr 값을 반환
//     res.json({
//       per,
//       pbr,
//       sale_account,
//       bsop_prti,
//       thtr_ntin,
//       grs,
//       bsop_prfi_inrt,
//       ntin_inrt,
//       roe_val,
//       eps,
//       bps,
//       rsrv_rate,
//       lblt_rate,
//       ev_ebitda,
//     });
//   } catch (error) {
//     console.error("Error while fetching external API:", error);
//     res.status(500).json({ error: "Internal server error2" });
//   }
// });

// module.exports = router;
