import SockJS from 'sockjs-client';
import Stomp from 'stompjs'
import readline from 'readline';
import * as baseStomp from '@stomp/stompjs'
import { Client } from '@stomp/stompjs'
import { WebSocket } from 'ws';
Object.assign(global, { WebSocket });

console.log(SockJS)
console.log(Stomp)

let stompClient = null;
let socket = null;
const RECONNECT_INTERVAL = 5000; // 5초 간격으로 재접속 시도

// 연결 생성 및 재접속 로직을 포함한 함수
function connect() {
  socket = new SockJS("http://localhost:8080/ws-chat");
  stompClient = Stomp.over(socket);

  stompClient.debug = (args) => {
    console.log('>>>', args);
  };

  stompClient.connect({}, (frame) => {
    console.log('Connected:', frame);

    const channel = '1234';
    const topic = `/topic/channel/${channel}`;

    stompClient.subscribe(topic, (message) => {
      console.log('Message received:', message);
    });

    const chatMessage = { channel: channel, sender: 'user1', content: 'Hello, world!' };
    stompClient.send('/topic/group', {}, JSON.stringify(chatMessage));

  }, (error) => {
    console.error('STOMP error:', error);
    // 재연결 시도
    reconnect();
  });

  // 연결 종료 시 재연결 시도
  socket.onclose = function() {
    console.log('Socket closed, attempting to reconnect...');
    reconnect();
  };

  // 소켓 에러 발생 시 재연결 시도
  socket.onerror = function(error) {
    console.error('Socket error:', error);
    // 재연결 시도
    reconnect();
  };
}

// 재접속 함수
function reconnect() {
  setTimeout(() => {
    connect();
  }, RECONNECT_INTERVAL);
}

// 처음 연결 시작
connect();



// readline 인터페이스 설정
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 키 입력 대기 함수
function waitForKeyPress() {
  rl.question('Press any key to continue...\n', (input) => {
    console.log(`You pressed: ${input}`);
    
    // 사용자가 원하는 로직을 여기서 실행할 수 있습니다.
    // 여기서는 단순히 프로세스를 종료하지 않고 다시 대기하도록 설정합니다.
    waitForKeyPress();
  });
}

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  stomp_client.disconnect(() => {
    console.log('Disconnected from WebSocket server.');
    process.exit(0);  // 프로세스를 종료
  });
});
