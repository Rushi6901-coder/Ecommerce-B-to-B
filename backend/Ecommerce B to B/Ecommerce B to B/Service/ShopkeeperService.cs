using Ecommerce_B_to_B.Data;
using Ecommerce_B_to_B.DTOs;
using Ecommerce_B_to_B.Models;
using Microsoft.EntityFrameworkCore;

public class ShopkeeperService : IShopkeeperService
{
    private readonly ApplicationDBContext _context;

    public ShopkeeperService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<Shopkeeper> RegisterAsync(RegisterShopkeeperDto dto)
    {
        // Check if email exists
        var existingShopkeeper = await _context.Shopkeepers
            .FirstOrDefaultAsync(s => s.Email == dto.Email);
        
        if (existingShopkeeper != null)
        {
            throw new InvalidOperationException("Email already registered");
        }

        var shopkeeper = new Shopkeeper
        {
            Name = dto.Name,
            ShopName = dto.ShopName,
            Email = dto.Email,
            Password = dto.Password // In real app, hash this
        };

        _context.Shopkeepers.Add(shopkeeper);
        await _context.SaveChangesAsync();

        return shopkeeper;
    }

    public async Task<Shopkeeper> LoginAsync(LoginShopkeeperDto dto)
    {
        var shopkeeper = await _context.Shopkeepers
            .FirstOrDefaultAsync(s => s.Email == dto.Email && s.Password == dto.Password);

        if (shopkeeper == null)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        return shopkeeper;
    }

    public async Task<List<Vendor>> GetVendorsAsync()
    {
        return await _context.Vendors.ToListAsync();
    }

    public async Task<List<Product>> GetVendorProductsAsync(int vendorId)
    {
        return await _context.Products
            .Where(p => p.VendorId == vendorId)
            .ToListAsync();
    }

    public async Task<ChatRoom> StartChatAsync(StartChatDto dto)
    {
        // Check if chat room already exists
        var existingChat = await _context.ChatRooms
            .FirstOrDefaultAsync(c => c.VendorId == dto.VendorId && c.ShopkeeperId == dto.ShopkeeperId);

        if (existingChat != null)
        {
            return existingChat;
        }

        // Create new chat room
        var chatRoom = new ChatRoom
        {
            VendorId = dto.VendorId,
            ShopkeeperId = dto.ShopkeeperId
        };

        _context.ChatRooms.Add(chatRoom);
        await _context.SaveChangesAsync();

        return chatRoom;
    }
}