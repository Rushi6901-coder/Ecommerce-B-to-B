using Ecommerce_B_to_B.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(
        IChatService chatService,
        IHubContext<ChatHub> hubContext)
    {
        _chatService = chatService;
        _hubContext = hubContext;
    }

    // SEND TEXT MESSAGE
    [HttpPost("send-text")]
    public async Task<IActionResult> SendText(SendMessageDto dto)
    {
        var message = await _chatService.SendTextMessageAsync(dto);

        await _hubContext.Clients
            .Group(dto.ChatRoomId.ToString())
            .SendAsync("ReceiveMessage", message);

        return Ok(message);
    }

    // SEND INVOICE / ESTIMATION
    [HttpPost("send-invoice")]
    public async Task<IActionResult> SendInvoice(SendInvoiceDto dto)
    {
        // Validation: Only vendors can send estimations/invoices
        // In real app, get this from JWT token or session
        // For now, assuming VendorId in DTO is validated
        
        try
        {
            var message = await _chatService.SendInvoiceAsync(dto);

            await _hubContext.Clients
                .Group(dto.ChatRoomId.ToString())
                .SendAsync("ReceiveMessage", message);

            return Ok(message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // GET CHAT HISTORY
    [HttpGet("{chatRoomId}")]
    public async Task<IActionResult> GetMessages(int chatRoomId)
    {
        var messages = await _chatService.GetMessagesAsync(chatRoomId);
        return Ok(messages);
    }
}
