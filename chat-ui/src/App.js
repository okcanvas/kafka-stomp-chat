// FLOW: when users type in new message, this message go through onSendMessage in the frontend 
// -> this will send to backend via chatAPI (use Axios to POST to "/api/send" in the ChatController)
// here, ChatController updates the timestamp and "forwards" this message to OFFICIAL KAFKA TOPIC    
// on the CONSUMER side (MessageListener), listen to the TOPIC. Here the message gets convert to WebSocket to display to CLIENTS
// SockJS will now onMessageReceived to display messages to CLIENTS
// ChatController defines SockJS: when a message is sent to /topic/group, it will broadcast to all SUBSCRIBERS 
import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Input from './components/Input/Input';
import LoginForm from './components/LoginForm';
import Messages from './components/Messages/Messages';
import chatAPI from './services/chatapi';
import { randomColor } from './utils/common';


// this endpoint is configured inside WebSocketConfig
const SOCKET_URL = 'http://localhost:8080/ws-chat/';
const channel = '1234';

const App = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [connected, setConnected] = useState(false)

  const onConnect = () => {
    setConnected(true);
    console.log("Connected!!")
  }
  const onDisconnect = () => {
    setConnected(false);
    console.log("DisConnected!!")
  }

  let onMessageReceived = (msg) => {
    console.log('New Message Received!! ', msg);
    // setMessages(messages.concat(msg));
    setMessages((messages) => [...messages, msg])
  }

  let onSendMessage = (msgText) => {
    chatAPI.sendMessage(channel, user.username, msgText).then(res => {
      console.log('Sent', res);
    }).catch(err => {
      console.log('Error Occured while sending message to api');
    })
  }

  let handleLoginSubmit = (username) => {
    console.log(username, " Logged in..");

    setUser({
      username: username,
      color: randomColor()
    })

  }

  return (
    <div className="App">
      {user ?
        (
          <>
          {/* // SockJS to listen to the messages, which are sent from the server-side WebSocket.  */}
          {/* SockJS will only handle INCOMING msgs, not SEND AWAY */}
            <SockJsClient
              url={SOCKET_URL}
              topics={['/topic/channel/', `/topic/channel/${channel}`]}
              onConnect={() => onConnect}
              onDisconnect={() => onDisconnect}
              onMessage={msg => onMessageReceived(msg)}
              debug={false}
            />
            <Messages
              messages={messages}
              currentUser={user}
            />
            <Input onSendMessage={onSendMessage} />
          </>
        ) :
        <LoginForm onSubmit={handleLoginSubmit} />
      }
    </div>
  )
}

export default App;
