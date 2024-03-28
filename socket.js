const { Server } = require("socket.io");
const { WebSocket } = require("ws");
const { getWebsocketKey } = require("./utils/token/KOInvToken")
const cron = require("node-cron");
const { isOpenSocket } = require("./utils/MarketOpen");

// 오전 8시 55분에 한투 웹소켓에 연결
cron.schedule('55 8 * * *', () => {
  webSocket = connectWebSocket();
})

const io = new Server({
  cors: {
    origin: "http://localhost:3000", //클라이언트 주소
    methods: ["GET", "POST"],
  },
});

// 서버 실행시 소켓 키 발급
let approval_key;
const getSocketKey = async () => {
  try {
    approval_key = await getWebsocketKey();
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
getSocketKey();

// Object와 유사한 자료구조. key:stockCode value:socketId
const stockMap = new Map();

// 디버깅용
const printStockMap = () => {
  const stockKeys = stockMap.keys();

  console.log("======================");
  console.log("stockKey 개수 : ", stockMap.size);
  for (let i = 0; i < stockMap.size; i++) {
    const stockKey = stockKeys.next().value;
    console.log(stockKey, stockMap.get(stockKey));
  }
  console.log("======================");
};

// 한투에 보낼 데이터 포맷을 지정
const sendDataFormat = (stockCode, tr_type) => {
  return JSON.stringify({
    header: {
      approval_key: approval_key,
      custtype: "P",
      tr_type: tr_type,
      "content-type": "utf-8",
    },
    body: {
      input: {
        tr_id: "H0STCNT0",
        tr_key: stockCode,
      },
    },
  });
};

// stockMap에 저장된 종목들의 format들을 return 하는 함수
const formatList = () => {
  const formatList = [];
  const stockKeys = stockMap.keys();
  for (let i = 0; i < stockMap.size; i++) {
    formatList.push(sendDataFormat(stockKeys.next().value, (tr_type = "1")));
  }
  return formatList;
};

const REALTIME_DOMESTIC_PRICE_URL = "ws://ops.koreainvestment.com:21000/";

// 한투에 연결할 socket 관련 로직이 담긴 함수. socket 개체를 반환한다.
function connectWebSocket() {
  const socket = new WebSocket(REALTIME_DOMESTIC_PRICE_URL);
  socket.onopen = () => {
    console.log("한투 소켓 연결");
    if (stockMap.size !== 0) {
      formatList().forEach((format) => {
        socket.send(format);
      });
    }
  };

  // 한투로부터 응답이 오면
  socket.onmessage = (result) => {
    const { data } = result;
    if (data[0] === "0" || data[0] === "1") {
      //실시간
      const recvstr = data.split("|");
      const data_cnt = Number(recvstr[2]);
      const stock_code = recvstr[3].slice(0, 6);
      const dataList = recvstr[3]
        .split(stock_code)
        .slice(1)
        .map((item) => stock_code + item);
      for (let i = 0; i < data_cnt; i++) {
        const detail = dataList[i].split("^");
        // console.log(`${stock_code} 현재가 : ${detail[2]} 전일대비율 : ${detail[5]}`)
        io.to(stock_code).emit("receiveStockPrice", {
          stockCode: stock_code,
          current: detail[2],
          ratioPrevious: detail[5],
          key: detail[13],
          open: detail[7],
          high: detail[8],
          low: detail[9],
        });
      }
    } else {
      const jsonObject = JSON.parse(data);
      const trid = jsonObject["header"]["tr_id"];
      // console.log(jsonObject)
      if (trid !== "PINGPONG") {
        // 어떠한 처리
        console.log(jsonObject.body.msg1);
        // res.json(data);
      } else if (trid === "PINGPONG") {
        // 실시간 데이터를 처리하지 못한 경우 PINGPONG 메시지만 주고 받음
        console.log("실시간 데이터 못 받아옴")
        if(!isOpenSocket()){
          socket.close();
        }
      }
    }
  };

  socket.onclose = () => {
    console.log("한투 연결 종료.");
    if(isOpenSocket()){
      webSocket = connectWebSocket();
    }
  }
  
  socket.onerror = (error) => {
    console.log("에러가 발생했어요", error);
  };

  return socket;
}

let webSocket = connectWebSocket();

// 클라이언트가 구독 원할 때
const addStockList = (stockCode, socketId) => {
  if (!stockMap.has(stockCode)) {
    stockMap.set(stockCode, new Set());
    webSocket.send(sendDataFormat(stockCode, (tr_type = "1")));
  }
  stockMap.get(stockCode).add(socketId);
};

// 클라이언트가 구독 취소할 때
const removeStockList = (stockCode, socketId) => {
  if (stockMap.has(stockCode)) {
    console.log("remove : " + stockCode);
    stockMap.get(stockCode).delete(socketId);

    if (stockMap.get(stockCode).size === 0) {
      stockMap.delete(stockCode);
      webSocket.send(sendDataFormat(stockCode, (tr_type = "2")));
    }
  }
};

// 클라이언트 관련
io.on("connection", (socket) => {
  const localRoomList = [];

  socket.on("joinRoom", (stockCode) => {
    socket.join(stockCode);
    addStockList(stockCode, socket.id);
    localRoomList.push(stockCode);
    printStockMap();
    // console.log("room에 접속:", stockCode)
  })
  
  socket.on('leaveRoom', (stockCode) => {
    socket.leave(stockCode); // 해당 종목 room에서 나가기
    for (let i = 0; i < localRoomList.length; i++) {
      if (localRoomList[i] === stockCode) {
        localRoomList.splice(i, 1);
        i--;
      }
    }
    removeStockList(stockCode, socket.id);
    // console.log("room 연결 끊김")
    printStockMap();
    console.log("room을 나감 : ", stockCode);
    // console.log('이후 room:', socket.rooms)
  });

  socket.on("disconnect", () => {
    console.log("socket 연결 끊김 : ", socket.id);
    localRoomList.forEach((stock) => {
      removeStockList(stock, socket.id);
    });
    printStockMap();
  });
});

module.exports = io;
