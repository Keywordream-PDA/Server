const { Server } = require("socket.io");
const { WebSocket } = require("ws");
require('dotenv').config();

// 한투 웹소켓 키 발급받기
const axios = require('axios')
let approval_key;

let data = {
  "grant_type" : "client_credentials",
  "appkey" : process.env.APP_KEY,
  "secretkey" : process.env.APP_SECRET
};

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://openapi.koreainvestment.com:9443/oauth2/Approval',
  headers: { 
    'content-type': 'application/json; utf-8'
  },
  data : data
};

axios.request(config)
.then((response) => {
  approval_key = response.data.approval_key
})
.catch((error) => {
  console.log('한투 웹소켓 키 발급 실패', error);
});

const io = new Server({
  cors: {
    origin: "http://localhost:3000", //클라이언트 주소
    methods: ["GET", "POST"],
  },
})

// Object와 유사한 자료구조. key:stockCode value:socketId
const stockMap = new Map();

const printStockMap = () => {
  const stockKeys = stockMap.keys()

  console.log("======================")
  console.log("stockKey 개수 : ",stockMap.size)
  for(let i=0; i<stockMap.size; i++){
      const stockKey = stockKeys.next().value;
      console.log(stockKey, stockMap.get(stockKey))
  }
  console.log("======================")
}

const sendDataFormat = (stockCode, tr_type) => {
  return JSON.stringify({
    "header": {
      "approval_key": approval_key,
      "custtype": "P",
      "tr_type": tr_type,
      "content-type": "utf-8"
    },
    "body": {
      "input": {
        "tr_id": "H0STCNT0",
        "tr_key": stockCode
      }
    }
  })
}

// stockMap에 저장된 종목들의 format들을 return 하는 함수
const formatList = () => {
  const formatList = []
  const stockKeys = stockMap.keys();
  for(let i=0; i<stockMap.size; i++){
    formatList.push(sendDataFormat(stockKeys.next().value, tr_type = "1"))
  }
  return formatList;
}

const REALTIME_DOMESTIC_PRICE_URL = "ws://ops.koreainvestment.com:21000/"

function connectWebSocket(){
  const websocket = new WebSocket(REALTIME_DOMESTIC_PRICE_URL)

  websocket.onopen = () => {
    console.log("한투 소켓 연결");
    if(stockMap.size !== 0){
      formatList().forEach(format => {
        websocket.send(format);
      })
    }
  }

  websocket.onmessage = (result) => {
    const { data } = result;
    if (data[0] === '0' || data[0] === '1') {
      //실시간
      const recvstr = data.split('|');
      const data_cnt = Number(recvstr[2]);
      const stock_code = recvstr[3].slice(0, 6);
      const dataList = recvstr[3].split(stock_code).slice(1).map(item => stock_code + item);
      for (let i = 0; i < data_cnt; i++) {
        const detail = dataList[i].split('^');
        // console.log(`${stock_code} 현재가 : ${detail[2]} 전일대비율 : ${detail[5]}`)
        io.to(stock_code).emit("receiveStockPrice", {stockCode: stock_code, current:detail[2], ratioPrevious: detail[5]})
      }
    } else {
      const jsonObject = JSON.parse(data)
      const trid = jsonObject["header"]["tr_id"]
      // console.log(jsonObject)
      if (trid !== "PINGPONG") {
        // 어떠한 처리
        console.log(jsonObject.body.msg1);
        // res.json(data);
      } else if (trid === "PINGPONG") {
        // 실시간 데이터를 처리하지 못한 경우 PINGPONG 메시지만 주고 받음
        websocket.close();
      }
    }
  }

  websocket.onclose = () => {
    console.log("한투 연결 종료."); // 장이 끝나면 
    webSocket = connectWebSocket();
  }
  
  websocket.onerror = (error) => {
    console.log("에러가 발생했어요")
  }

  return websocket;
}

let webSocket = connectWebSocket();


const addStockList = (stockCode, socketId) => {
  if(!stockMap.has(stockCode)){
    stockMap.set(stockCode, new Set())
    webSocket.send(sendDataFormat(stockCode, tr_type = "1"));
  } 
  stockMap.get(stockCode).add(socketId)
}

const removeStockList = (stockCode, socketId) => {
    if(stockMap.has(stockCode)){
      console.log("remove : "+ stockCode)
      stockMap.get(stockCode).delete(socketId)
  
      if(stockMap.get(stockCode).size === 0){
        stockMap.delete(stockCode);
        webSocket.send(sendDataFormat(stockCode, tr_type = "2"));
      }
    }
}


io.on("connection", (socket) => {
  const localRoomList = [];

  socket.on('joinRoom', (stockCode) => {
    socket.join(stockCode)
    addStockList(stockCode, socket.id);
    localRoomList.push(stockCode);
    printStockMap();
    console.log("room에 접속:", stockCode)
    console.log('이후 room:', socket.rooms)
  })
  
  socket.on('leaveRoom', (stockCode) => {
    socket.leave(stockCode); // 해당 종목 room에서 나가기
    localRoomList.pop(stockCode);
    removeStockList(stockCode, socket.id);
    console.log("room 연결 끊김")
    printStockMap()
    console.log("room을 나감 : ", stockCode)
    console.log('이후 room:', socket.rooms)
  })

  socket.on("disconnect", () => {
    console.log("socket 연결 끊김 : ", socket.id);
    localRoomList.forEach(stock => {
      removeStockList(stock, socket.id);
    })
    printStockMap()
    console.log("disconnect stockList : ", stockList)
    console.log("프론트 소켓 연결 끊김");
  })

})

module.exports = io;