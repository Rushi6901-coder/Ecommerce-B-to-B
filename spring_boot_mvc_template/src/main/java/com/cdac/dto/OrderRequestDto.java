package com.cdac.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDto {
    private Long shopkeeperId;
    private Long vendorId;
    private List<OrderItemDto> items;
}
