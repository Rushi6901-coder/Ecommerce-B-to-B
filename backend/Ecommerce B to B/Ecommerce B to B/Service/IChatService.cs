using Ecommerce_B_to_B.DTOs;
using Ecommerce_B_to_B.Models;

public interface IChatService
{
    Task<Message> SendTextMessageAsync(SendMessageDto dto);
    Task<Message> SendInvoiceAsync(SendInvoiceDto dto);
    Task<List<Message>> GetMessagesAsync(int chatRoomId);
}

