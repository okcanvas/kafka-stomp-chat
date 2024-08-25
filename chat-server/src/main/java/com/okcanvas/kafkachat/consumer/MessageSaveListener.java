package com.okcanvas.kafkachat.consumer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

import com.okcanvas.kafkachat.model.Message;

@Component
public class MessageSaveListener {

    private ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "${kafka.topic}", groupId = "message-save-group")
    public void listenAndSave(List<Message> messages) {
        System.out.println("메세지 수: " + messages.size());
        System.out.println("한번의 쿼리로 DB에 저장하길 추천합니다.");
        try {
            for (Message message : messages) {
                System.out.println("Message : " + message.toString());
            }
            
            // 메시지를 DB에 저장
            //chatMessageRepository.save(chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
