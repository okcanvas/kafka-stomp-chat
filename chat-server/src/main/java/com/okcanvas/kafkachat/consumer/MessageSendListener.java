package com.okcanvas.kafkachat.consumer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.okcanvas.kafkachat.model.Message;

@Component
public class MessageSendListener {

    @Autowired
    SimpMessagingTemplate template;

    @KafkaListener(topics = "${kafka.topic}", groupId = "${kafka.group-id}")
    public void listenAndSend(Message message) {
        // WebSocket 경로 설정: 예를 들어 "/topic/room/{roomId}"
        // channel(채팅방) 구독자에게만 메세지 전송
        String channel = message.getChannel();
        String destination = "/topic/channel/" + channel;
        template.convertAndSend(destination, message);

        System.out.println("메세지전송");
        System.out.println("구독채널 : " + destination);
        System.out.println("메세지 : " + message.toString());


        // 전체접속자에게 전송
        // template.convertAndSend("/topic/channel", message);
    }
}
