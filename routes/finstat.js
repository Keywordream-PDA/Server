const express = require("express");
const axios = require("axios");
const router = express.Router();
const mariadb = require("../database/connect/mariadb");

router.get("/info", async (req, res) => {
  try {
    // 1. 주식현재가 시세 API
    const apiUrl1 =
      "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price";

    const queryParameters1 = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: "J",
      FID_INPUT_ISCD: "005930",
    });

    const headers1 = {
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjAzMjZhYzY5LTdlYjEtNDQxNC04ZjdiLWRhNDlhZmJhODY4MiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzEwOTc3OTY1LCJpYXQiOjE3MTA4OTE1NjUsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.cQQ12usbNDswD74IXG4xhvldad0kWNIZcfEnyeWvLggEbiAmoyskhRfP6Hh8WrJJl1R8KXyGUB-4nHrHGDWdLg",
      appkey: "PSzo0xRNAXE6XyA5OJdkmSJIYwuVUGgSHg2l",
      appsecret:
        "HFPFfK5VyqCgIHgitad9JFcSlUWhEOmiTD2MOTYIt9jlrj/KxKGz/kU3z2kGcmO/vtxHvMPLHtIAi7j4r+TEhBHNzYI9xv/fd6n/h5E6Mrm3k4lVQeSNygL+W/w206htErKXKkUsz2CCI3UcD9xQMHDfsS+5LZy2JeZCK9gvnAAJNGOFNug=",
      tr_id: "FHKST01010100",
    };

    const response1 = await axios.get(
      `${apiUrl1}?${queryParameters1.toString()}`,
      { headers: headers1 }
    );
    const responseData1 = response1.data;

    // "per"과 "pbr"
    const { per, pbr } = responseData1.output;

    // 2. 국내주식 손익계산서 API
    const apiUrl2 =
      "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/income-statement";

    const queryParameters2 = new URLSearchParams({
      FID_DIV_CLS_CODE: "0",
      fid_cond_mrkt_div_code: "J",
      fid_input_iscd: "005930",
    });

    const headers2 = {
      "content-type": "application/json; charset=utf-8",
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjAzMjZhYzY5LTdlYjEtNDQxNC04ZjdiLWRhNDlhZmJhODY4MiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzEwOTc3OTY1LCJpYXQiOjE3MTA4OTE1NjUsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.cQQ12usbNDswD74IXG4xhvldad0kWNIZcfEnyeWvLggEbiAmoyskhRfP6Hh8WrJJl1R8KXyGUB-4nHrHGDWdLg",
      appkey: "PSzo0xRNAXE6XyA5OJdkmSJIYwuVUGgSHg2l",
      appsecret:
        "HFPFfK5VyqCgIHgitad9JFcSlUWhEOmiTD2MOTYIt9jlrj/KxKGz/kU3z2kGcmO/vtxHvMPLHtIAi7j4r+TEhBHNzYI9xv/fd6n/h5E6Mrm3k4lVQeSNygL+W/w206htErKXKkUsz2CCI3UcD9xQMHDfsS+5LZy2JeZCK9gvnAAJNGOFNug=",
      tr_id: "FHKST66430200",
      custtype: "P",
    };

    const response2 = await axios.get(
      `${apiUrl2}?${queryParameters2.toString()}`,
      { headers: headers2 }
    );
    const responseData2 = response2.data;
    const { stac_yymm, sale_account, bsop_prti, thtr_ntin } =
      responseData2.output[0];

    // 3. 국내주식 재무비율
    const apiUrl3 =
      "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/financial-ratio";

    const queryParameters3 = new URLSearchParams({
      FID_DIV_CLS_CODE: "0",
      fid_cond_mrkt_div_code: "J",
      fid_input_iscd: "005930",
    });

    const headers3 = {
      "content-type": "application/json; charset=utf-8",
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjAzMjZhYzY5LTdlYjEtNDQxNC04ZjdiLWRhNDlhZmJhODY4MiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzEwOTc3OTY1LCJpYXQiOjE3MTA4OTE1NjUsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.cQQ12usbNDswD74IXG4xhvldad0kWNIZcfEnyeWvLggEbiAmoyskhRfP6Hh8WrJJl1R8KXyGUB-4nHrHGDWdLg",
      appkey: "PSzo0xRNAXE6XyA5OJdkmSJIYwuVUGgSHg2l",
      appsecret:
        "HFPFfK5VyqCgIHgitad9JFcSlUWhEOmiTD2MOTYIt9jlrj/KxKGz/kU3z2kGcmO/vtxHvMPLHtIAi7j4r+TEhBHNzYI9xv/fd6n/h5E6Mrm3k4lVQeSNygL+W/w206htErKXKkUsz2CCI3UcD9xQMHDfsS+5LZy2JeZCK9gvnAAJNGOFNug=",
      tr_id: "FHKST66430300",
      custtype: "P",
    };

    const response3 = await axios.get(
      `${apiUrl3}?${queryParameters3.toString()}`,
      { headers: headers3 }
    );
    const responseData3 = response3.data;
    const {
      grs,
      bsop_prfi_inrt,
      ntin_inrt,
      roe_val,
      eps,
      bps,
      rsrv_rate,
      lblt_rate,
    } = responseData3.output[0];

    // 4. 국내주식 기타주요비율

    const apiUrl4 =
      "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/finance/other-major-ratios";

    const queryParameters4 = new URLSearchParams({
      FID_DIV_CLS_CODE: "0",
      fid_cond_mrkt_div_code: "J",
      fid_input_iscd: "005930",
    });

    const headers4 = {
      "content-type": "application/json; charset=utf-8",
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjAzMjZhYzY5LTdlYjEtNDQxNC04ZjdiLWRhNDlhZmJhODY4MiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzEwOTc3OTY1LCJpYXQiOjE3MTA4OTE1NjUsImp0aSI6IlBTem8weFJOQVhFNlh5QTVPSmRrbVNKSVl3dVZVR2dTSGcybCJ9.cQQ12usbNDswD74IXG4xhvldad0kWNIZcfEnyeWvLggEbiAmoyskhRfP6Hh8WrJJl1R8KXyGUB-4nHrHGDWdLg",
      appkey: "PSzo0xRNAXE6XyA5OJdkmSJIYwuVUGgSHg2l",
      appsecret:
        "HFPFfK5VyqCgIHgitad9JFcSlUWhEOmiTD2MOTYIt9jlrj/KxKGz/kU3z2kGcmO/vtxHvMPLHtIAi7j4r+TEhBHNzYI9xv/fd6n/h5E6Mrm3k4lVQeSNygL+W/w206htErKXKkUsz2CCI3UcD9xQMHDfsS+5LZy2JeZCK9gvnAAJNGOFNug=",
      tr_id: "FHKST66430500",
      custtype: "P",
    };

    const response4 = await axios.get(
      `${apiUrl4}?${queryParameters4.toString()}`,
      { headers: headers4 }
    );

    const responseData4 = response4.data;
    const { ev_ebitda } = responseData4.output[0];

    // const mappedData = {
    //   per,
    //   pbr,
    //   saleAccount: sale_account,
    //   bsopPrti: bsop_prti,
    //   thtrNtin: thtr_ntin,
    //   grs,
    //   bsopPrfiInrt: bsop_prfi_inrt,
    //   ntinInrt: ntin_inrt,
    //   roeVal: roe_val,
    //   eps,
    //   bps,
    //   rsrvRate: rsrv_rate,
    //   lbltRate: lblt_rate,
    //   evEbitda: ev_ebitda,
    // };

    // // 데이터베이스에 저장
    // await mariadb.saveDataToDatabase(mappedData);

    // 클라이언트에 per과 pbr 값을 반환
    res.json({
      per,
      pbr,
      sale_account,
      bsop_prti,
      thtr_ntin,
      grs,
      bsop_prfi_inrt,
      ntin_inrt,
      roe_val,
      eps,
      bps,
      rsrv_rate,
      lblt_rate,
      ev_ebitda,
    });
  } catch (error) {
    console.error("Error while fetching external API:", error);
    res.status(500).json({ error: "Internal server error2" });
  }
});

module.exports = router;
