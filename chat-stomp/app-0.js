import * as StompJs from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { WebSocket } from 'ws';
Object.assign(global, { WebSocket });

const socketUrl = 'http://localhost:8080/ws-chat';
const channel = '1234';
//const channel = '12345';
const topic = `/topic/channel/${channel}`;

// 메시지 카운트 관련 변수
let messageCount = 0;


const stomp = new StompJs.Client({
  webSocketFactory: () => new SockJS(socketUrl),
  //connectHeaders: {
    //Authorization: `Bearer ${access}`,
  //},
  //connectHeaders: {
  //  login: "",
  //  passcode: "password",
  //},
  debug: (str) => {
    console.log(str)
  },
  //reconnectDelay: 5000, //자동 재 연결
  //heartbeatIncoming: 10000,
  //heartbeatOutgoing: 10000,
  onConnect: () => {
    console.log(`onConnect`)
    stomp.subscribe(topic, message => {
      messageCount++;
      //console.log(`Received: ${message}`, JSON.parse(message.body))
    });
    //stomp.publish({ destination: topic, body: JSON.stringify({channel: "1234", sender: "111", content: "First Message"}) });
  },
  onStompError: (e) => {
    console.log('onStompError', e)
  },
  onWebSocketError: (e) => {
    console.log('onWebSocketError', e)
  },
})

stomp.activate()

// 카운트를 초기화
setInterval(() => {
  console.log(`Messages per second: ${messageCount}`, new Date());
  messageCount = 0; 
}, 1000);

// 메세지전송
function sendMessage() {
  if (stomp.connected) {
    for (let i=0; i<1; i++) {
      stomp.publish({ destination: topic, body: JSON.stringify({channel: channel, sender: "111", content: "loop message"}) });
    }
    setTimeout(() => { sendMessage() }, 1000)
  } else {
    setTimeout(() => { sendMessage() }, 1000)
  }
}
sendMessage();
