package com.cdac.repository;

import com.cdac.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByVendorIdAndShopkeeperId(Long vendorId, Long shopkeeperId);
    List<ChatRoom> findByVendorId(Long vendorId);
    List<ChatRoom> findByShopkeeperId(Long shopkeeperId);
}
