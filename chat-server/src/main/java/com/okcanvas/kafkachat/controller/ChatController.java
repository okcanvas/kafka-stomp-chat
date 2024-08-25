package com.okcanvas.kafkachat.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import com.okcanvas.kafkachat.model.Message;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;
//import javax.validation.Valid;
//import javax.validation.constraints.NotNull;

@RestController
public class ChatController {

    @Value("${kafka.topic}")
    private String channelTopic;

    @Autowired
    private KafkaTemplate<String, Message> kafkaTemplate;

    @CrossOrigin(origins = "*") // 모든 도메인에서의 요청 허용
    @PostMapping(value = "/api/send", consumes = "application/json", produces = "application/json")
    public void sendMessage(
        //@NotNull(message = "channel") @RequestParam String channel,
        @RequestBody Message message
    ) {
        message.setTimestamp(LocalDateTime.now().toString());
        try {
            System.out.println("/api/send : " + message.toString());

            // Sending the message to kafka topic queue producer side -- producerConfiguration
            kafkaTemplate.send(channelTopic, message).get();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    

    //    -------------- WebSocket API ----------------
    // '/app/sendMessage' 경로로 메세지 전송...
    @MessageMapping("/sendMessage")
    @SendTo("/topic/channel") // the topic inside WebSocket
    public Message broadcastGroupMessage(@Payload Message message) {
        //Sending this message to all the subscribers
        return message;
    }

    @MessageMapping("/newUser")
    @SendTo("/topic/channel")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        // Add user in web socket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }

}
