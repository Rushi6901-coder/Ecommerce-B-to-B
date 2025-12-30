using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.DTOs;
using Ecommerce_B_to_B.Models;
using Microsoft.EntityFrameworkCore;

public class ChatService : IChatService
{
    private readonly ApplicationDBContext _context;

    public ChatService(ApplicationDBContext context)
    {
        _context = context;
    }

    // TEXT MESSAGE
    public async Task<Message> SendTextMessageAsync(SendMessageDto dto)
    {
        var message = new Message
        {
            ChatRoomId = dto.ChatRoomId,
            SenderId = dto.SenderId,
            SenderRole = dto.SenderRole,
            MessageType = "Text",
            Content = dto.Content
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return message;
    }

    // INVOICE / ESTIMATION - Chat-Driven Order System
    public async Task<Message> SendInvoiceAsync(SendInvoiceDto dto)
    {
        Order order;

        if (dto.MessageType == "Estimation")
        {
            // CREATE NEW ORDER when Estimation is sent
            order = new Order
            {
                VendorId = dto.VendorId,
                ShopkeeperId = dto.ShopkeeperId,
                TotalAmount = dto.TotalAmount,
                OrderStatus = "Estimated"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }
        else if (dto.MessageType == "Invoice")
        {
            // UPDATE EXISTING ORDER when Invoice is sent
            order = await _context.Orders
                .Where(o => o.VendorId == dto.VendorId && o.ShopkeeperId == dto.ShopkeeperId)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new InvalidOperationException("No estimation found. Send estimation first.");
            }

            // Update existing order
            order.TotalAmount = dto.TotalAmount;
            order.OrderStatus = "Pending";
            await _context.SaveChangesAsync();
        }
        else
        {
            throw new ArgumentException("MessageType must be 'Estimation' or 'Invoice'");
        }

        // Create chat message linked to order
        var message = new Message
        {
            ChatRoomId = dto.ChatRoomId,
            SenderId = dto.VendorId,
            SenderRole = "Vendor",
            MessageType = dto.MessageType,
            Content = dto.Content,
            OrderId = order.OrderId
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return message;
    }

    // GET CHAT HISTORY
    public async Task<List<Message>> GetMessagesAsync(int chatRoomId)
    {
        return await _context.Messages
            .Where(m => m.ChatRoomId == chatRoomId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();
    }
}
