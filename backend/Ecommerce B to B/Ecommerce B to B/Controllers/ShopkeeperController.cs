using Ecommerce_B_to_B.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/shopkeeper")]
public class ShopkeeperController : ControllerBase
{
    private readonly IShopkeeperService _shopkeeperService;
    private readonly IChatService _chatService;

    public ShopkeeperController(IShopkeeperService shopkeeperService, IChatService chatService)
    {
        _shopkeeperService = shopkeeperService;
        _chatService = chatService;
    }

    // REGISTER SHOPKEEPER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterShopkeeperDto dto)
    {
        try
        {
            var shopkeeper = await _shopkeeperService.RegisterAsync(dto);
            return Ok(new { message = "Registration successful", shopkeeper });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // LOGIN SHOPKEEPER
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginShopkeeperDto dto)
    {
        try
        {
            var shopkeeper = await _shopkeeperService.LoginAsync(dto);
            return Ok(new { message = "Login successful", shopkeeper });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    // VIEW VENDOR LIST
    [HttpGet("vendors")]
    public async Task<IActionResult> GetVendors()
    {
        var vendors = await _shopkeeperService.GetVendorsAsync();
        return Ok(vendors);
    }

    // VIEW VENDOR PRODUCTS
    [HttpGet("vendors/{vendorId}/products")]
    public async Task<IActionResult> GetVendorProducts(int vendorId)
    {
        var products = await _shopkeeperService.GetVendorProductsAsync(vendorId);
        return Ok(products);
    }

    // START CHAT WITH VENDOR
    [HttpPost("start-chat")]
    public async Task<IActionResult> StartChat(StartChatDto dto)
    {
        var chatRoom = await _shopkeeperService.StartChatAsync(dto);
        return Ok(chatRoom);
    }

    // SEND CHAT MESSAGE
    [HttpPost("send-message")]
    public async Task<IActionResult> SendMessage(SendMessageDto dto)
    {
        var message = await _chatService.SendTextMessageAsync(dto);
        return Ok(message);
    }

    // VIEW CHAT HISTORY
    [HttpGet("chat/{chatRoomId}")]
    public async Task<IActionResult> GetChatHistory(int chatRoomId)
    {
        var messages = await _chatService.GetMessagesAsync(chatRoomId);
        return Ok(messages);
    }
}