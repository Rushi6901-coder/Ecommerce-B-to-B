package com.cdac.repository;

import com.cdac.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomIdOrderByTimestampAsc(Long chatRoomId);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByChatRoomId(Long chatRoomId);
}
